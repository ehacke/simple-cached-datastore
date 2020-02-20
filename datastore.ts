import { Cached, Redis } from '@ehacke/redis';
import { Datastore as GoogleDatastore, Query } from '@google-cloud/datastore';
import { entity } from '@google-cloud/datastore/build/src/entity';
import Bluebird from 'bluebird';
import cleanDeep from 'clean-deep';
import Err from 'err';
import stringify from 'fast-json-stable-stringify';
import flatten from 'flat';
import { defaultsDeep, isDate, reduce, set } from 'lodash';
import { DateTime } from 'luxon';
import pino from 'pino';
import Redlock from 'redlock';
import { DeepPartial } from 'ts-essentials';

const log = pino({ prettyPrint: true });

export enum FILTER_OPERATORS {
  GT = '>',
  GTE = '>=',
  LT = '<',
  LTE = '<=',
  EQ = '=',
  CONTAINS = '=',
}

export type DalModelValue = string | Date | number | null | boolean;

export interface ListFilterInterface {
  property: string;
  operator: FILTER_OPERATORS;
  value: DalModelValue;
}

export enum SORT_DIRECTION {
  ASC = 'asc',
  DESC = 'desc',
}

export interface ListSortInterface {
  property: string;
  direction: SORT_DIRECTION;
}

export interface QueryInterface {
  filters?: ListFilterInterface[];
  sort?: ListSortInterface;
  offset?: number;
  limit?: number;
}

export interface DalSchema {
  excludeFromIndexes: string[];
}

export interface DalModel {
  id: string;
  validate(): any;
  getDalSchema(): DalSchema;
  createdAt: Date;
  updatedAt: Date;
}

interface ServicesInterface {
  datastore: GoogleDatastore;
  redis: Redis;
  log?: pino.Logger | undefined;
}

interface InternalServicesInterface {
  datastore: GoogleDatastore;
  redis: Redis;
  log: pino.Logger;
}

interface ConfigInterface {
  logConfig?: pino.LoggerOptions;
}

export interface DatastoreConfigInterface<T extends DalModel> {
  collection: string;
  convertForDb(instance: DeepPartial<T>): any;
  convertFromDb(params: any): T | Promise<T>;
}

export interface DatastoreCacheConfigInterface<T extends DalModel> {
  cacheTtlSec: number;
  stringifyForCache(instance: T): Promise<string> | string;
  parseFromCache(instance: string): Promise<T> | T;
}

const CLEAN_CONFIG = {
  emptyArrays: false,
  emptyObjects: false,
  emptyStrings: false,
  nullValues: false,
  undefinedValues: true,
};

const CONFIG_ERROR = 'datastore instance not configured';

const CONSTANTS = {
  MAX_LOCK_ATTEMPTS: 15,
  LOCK_DELAY_MS: 150,
  RETRY_JITTER_MS: 30,
  LOCK_TTL_MS: 5000,
  LOCK_PREFIX: 'datastore-',
};

/**
 * @class
 */
export class Datastore<T extends DalModel> extends Cached<T> {
  readonly patchLock: Redlock;

  /**
   * @param {ServicesInterface} services
   * @param {DatastoreConfigInterface} config
   * @param {DatastoreCacheConfigInterface<T>} cacheConfig
   */
  constructor(services: ServicesInterface, config?: ConfigInterface) {
    super();

    const logOptions = defaultsDeep({}, config?.logConfig, { name: 'datastore', prettyPrint: { colorize: true } });

    this.services = {
      ...services,
      log: pino(logOptions),
    };

    this.patchLock = services.redis.createRedlock({
      retryCount: CONSTANTS.MAX_LOCK_ATTEMPTS,
      retryDelay: CONSTANTS.LOCK_DELAY_MS,
      retryJitter: CONSTANTS.RETRY_JITTER_MS,
    });
  }

  /**
   * Configure datastore
   * @param {DatastoreConfigInterface<T>} config
   * @param {DatastoreCacheConfigInterface<T>} cacheConfig
   * @returns {void}
   */
  configure(config: DatastoreConfigInterface<T>, cacheConfig?: DatastoreCacheConfigInterface<T>): void {
    this.config = config;

    const { redis } = this.services;

    if (cacheConfig) {
      const { cacheTtlSec: ttlSec, stringifyForCache, parseFromCache } = cacheConfig;
      this.configureCache({ redis }, { ttlSec, stringifyForCache, parseFromCache, prefix: config.collection });
    }
  }

  readonly services: InternalServicesInterface;

  private config?: DatastoreConfigInterface<T>;

  /**
   * Clean model of common properties that shouldn't be written
   * @param {{}} model
   * @returns {{}}
   */
  private static cleanModel(model: { [k: string]: any }): { [k: string]: any } {
    model = { ...model };

    if (model.createdAt) delete model.createdAt;
    if (model.id) delete model.id;

    return cleanDeep(model, CLEAN_CONFIG);
  }

  /**
   * Build datastore query from structured query
   * @param {QueryInterface} query
   * @returns {Query}
   */
  private getQuery(query: QueryInterface): Query {
    if (!this.config) throw new Err(CONFIG_ERROR);

    let datastoreQuery = this.services.datastore.createQuery(this.config.collection);

    if (query.filters) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore // assuming the filter banning null is wrong
      datastoreQuery = reduce(query.filters, (result, filter) => result.filter(filter.property, filter.operator, filter.value), datastoreQuery);
    }

    if (query.offset) {
      datastoreQuery = datastoreQuery.offset(query.offset);
    }

    if (query.sort) {
      datastoreQuery = datastoreQuery.order(query.sort.property, { descending: query.sort.direction === SORT_DIRECTION.DESC });
    }

    if (query.limit) {
      datastoreQuery = datastoreQuery.limit(query.limit);
    }

    return datastoreQuery;
  }

  /**
   * Create instance of model in db
   * @param {T} instance
   * @returns {Promise<T>}
   */
  async create(instance: T): Promise<T> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    await instance.validate();

    // I don't know why that casting is necessary
    const data = cleanDeep(await this.config.convertForDb(instance as DeepPartial<T>), CLEAN_CONFIG);

    if (!isDate(data.createdAt)) {
      throw new Err('createdAt must be a Date');
    }

    if (!isDate(data.updatedAt)) {
      throw new Err('updatedAt must be a Date');
    }

    await this.cache.del(instance.id);
    await this.cache.delLists();

    const { excludeFromIndexes = [] } = instance.getDalSchema();
    await this.services.datastore.insert({ key: this.getKey(instance.id), data, excludeFromIndexes, excludeLargeProperties: true }).catch((error) => {
      if (error.message.includes('ALREADY_EXISTS')) {
        log.error(`Collision creating: ${JSON.stringify(instance)}`);
        throw new Err('Internal error creating record');
      }

      throw error;
    });

    await this.cache.delLists();
    await this.cache.set(instance.id, instance);

    return instance;
  }

  /**
   * Get instance
   * @param {string} id
   * @returns {Promise<T | null>}
   */
  async get(id: string): Promise<T | null> {
    let instance = await this.cache.get(id);
    if (instance) return instance;
    instance = await this.internalGet(id);

    if (instance) {
      await this.cache.set(id, instance);
    } else {
      await this.cache.del(id);
    }

    return instance;
  }

  /**
   * Get datastore key based on id
   * @param {string} id
   * @returns {entity.Key}
   */
  getKey(id: string): entity.Key {
    if (!this.config) throw new Err(CONFIG_ERROR);
    return this.services.datastore.key([this.config.collection, id]);
  }

  /**
   * Get instance without touching cache
   * @param {string} id
   * @returns {Promise<T | null>}
   */
  private async internalGet(id: string): Promise<T | null> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    const [data] = await this.services.datastore.get(this.getKey(id));
    try {
      const result = data ? await this.config.convertFromDb({ id, ...data }) : null;
      if (!result) await this.cache.del(id);
      return result;
    } catch (error) {
      log.error(`Error while reading from db: ${error.message}`);
      log.error('Data: ', data);
      throw error;
    }
  }

  /**
   * Get value directly from the db, by-passing cache and convertFromDb
   * @param {string} id
   * @returns {Promise<any | null>}
   */
  async rawGet(id: string): Promise<any | null> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    const [data] = await this.services.datastore.get(this.getKey(id));
    return data ? { id, ...data } : null;
  }

  /**
   * Get instance or throw
   * @param {string} id
   * @param {boolean} throw404
   * @returns {Promise<T>}
   */
  async getOrThrow(id: string, throw404 = false): Promise<T> {
    let instance = await this.cache.get(id);
    if (instance) return instance;

    instance = await this.internalGetOrThrow(id, throw404);
    await this.cache.set(id, instance);
    return instance;
  }

  /**
   * Internal get or throw without touching cache
   * @param {string} id
   * @param {boolean} throw404
   * @returns {Promise<T>}
   */
  private async internalGetOrThrow(id: string, throw404 = false): Promise<T> {
    const instance = await this.internalGet(id);
    if (!instance) throw new Err(`id: ${id} not found`, throw404 ? Err.HTTP_STATUS.NOT_FOUND : Err.HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return instance;
  }

  /**
   * Get lock key
   * @param {string} id
   * @returns {string}
   */
  private getLockKey(id: string): string {
    if (!this.config) throw new Err(CONFIG_ERROR);
    return `${CONSTANTS.LOCK_PREFIX}${this.config.collection}${id}`;
  }

  /**
   * Update properties of model
   * @param {string} id
   * @param {{}} patchUpdate
   * @param {Date} [curDate]
   * @returns {Promise<T>}
   */
  async patch(id: string, patchUpdate: DeepPartial<T>, curDate = DateTime.utc().toJSDate()): Promise<T> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    const flattened = flatten(Datastore.cleanModel({ ...(await this.config.convertForDb(patchUpdate)), updatedAt: curDate }));

    const key = this.getKey(id);
    const lock = await this.patchLock.lock(this.getLockKey(id), CONSTANTS.LOCK_TTL_MS).catch((error) => {
      log.error(error.stack);
      return null;
    });

    if (!lock) {
      log.error(`Could not get lock on: ${id}`);
      throw new Err('Could lock for update');
    }

    try {
      await this.cache.del(id);
      await this.cache.delLists();

      const transaction = this.services.datastore.transaction();
      let data;

      try {
        await transaction.run();
        const [currentData] = await transaction.get(key);
        data = reduce(flattened, (result, value, path) => set(result, path, value), currentData);
        // DO NOT AWAIT THIS. It blocks until the transaction completes
        transaction.save({ key, data, excludeLargeProperties: true });
        await transaction.commit();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }

      // TODO: Add tests for this unlock before convert
      await lock.unlock();
      const instance = await this.config.convertFromDb(data);
      await this.cache.delLists();
      await this.cache.set(id, instance);

      return instance;
    } catch (error) {
      await lock.unlock().catch((_error) => {
        if (_error?.message?.includes('LockError: Unable to fully release the lock')) {
          log.error(_error.stack);
          return null;
        }

        throw _error;
      });
      log.error(`Error during transaction: ${error.stack}`);

      throw error;
    }
  }

  /**
   * Model exists
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async exists(id: string): Promise<boolean> {
    return !!(await this.get(id));
  }

  /**
   * Remove model
   * @param {string} id
   * @returns {Promise<void>}
   */
  async remove(id: string): Promise<void> {
    await this.internalRemove(id);
    await this.cache.del(id);
    await this.cache.delLists();
  }

  /**
   * Remove model without touching cache
   * @param {string} id
   * @returns {Promise<void>}
   */
  private async internalRemove(id: string): Promise<void> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    await this.services.datastore.delete(this.getKey(id));
  }

  /**
   * Overwrite model
   * @param {string} id
   * @param {{}} instance
   * @param {Date} [curDate]
   * @returns {Promise<T>}
   */
  async update(id: string, instance: T, curDate = DateTime.utc().toJSDate()): Promise<T> {
    if (!this.config) throw new Err(CONFIG_ERROR);

    await instance.validate();

    await this.cache.del(id);
    await this.cache.delLists();

    // I don't know why that casting is necessary
    const updated = { ...(await this.config.convertForDb(instance as DeepPartial<T>)), updatedAt: curDate, id };

    await this.services.datastore.merge({ key: this.getKey(id), excludeLargeProperties: true, data: Datastore.cleanModel(updated) });

    const updatedInstance = await this.config.convertFromDb(updated);
    await this.cache.del(id);
    await this.cache.delLists();
    await this.cache.set(id, updatedInstance);
    return updatedInstance;
  }

  /**
   * List models satisfying query
   * @param {QueryInterface} query
   * @returns {Promise<T[]>}
   */
  async query(query: QueryInterface): Promise<T[]> {
    const cacheKey = stringify(query);
    let results = await this.cache.getList(cacheKey);
    if (results) return results;

    const [rawResults] = await this.getQuery(query).run();

    results = await Bluebird.map(rawResults, (rawResult) => {
      const { name: id } = rawResult[this.services.datastore.KEY];

      if (!this.config) throw new Err(CONFIG_ERROR);
      return this.config.convertFromDb({ ...rawResult, id });
    });

    await this.cache.setList(cacheKey, results);
    return results;
  }

  /**
   * Get value directly from the db, by-passing cache and convertFromDb
   * @param {QueryInterface} query
   * @returns {Promise<any[]>}
   */
  async rawQuery(query: QueryInterface): Promise<any[]> {
    const [rawResults] = await this.getQuery(query).run();

    return rawResults.map((rawResult) => {
      const { name: id } = rawResult[this.services.datastore.KEY];
      return { ...rawResult, id };
    });
  }

  /**
   * Remove by query
   * @param {QueryInterface} query
   * @returns {Promise<void>}
   */
  async removeByQuery(query: QueryInterface): Promise<string[]> {
    const [rawResults] = await this.getQuery(query).run();
    const ids = rawResults.map((rawResult) => {
      const { name: id } = rawResult[this.services.datastore.KEY];
      return id;
    });

    await this.cache.delLists();

    await Bluebird.map(ids, async (id) => {
      await this.cache.del(id);
      await this.internalRemove(id);
      return id;
    });

    await this.cache.delLists();

    return ids;
  }
}
