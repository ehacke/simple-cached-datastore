[simple-cached-datastore](../README.md) › ["datastore"](../modules/_datastore_.md) › [Datastore](_datastore_.datastore.md)

# Class: Datastore <**T**>

## Type parameters

▪ **T**: *[DalModel](../interfaces/_datastore_.dalmodel.md)*

## Hierarchy

* Cached‹T›

  ↳ **Datastore**

## Index

### Constructors

* [constructor](_datastore_.datastore.md#constructor)

### Properties

* [config](_datastore_.datastore.md#private-optional-config)
* [patchLock](_datastore_.datastore.md#patchlock)
* [services](_datastore_.datastore.md#services)

### Accessors

* [cache](_datastore_.datastore.md#cache)

### Methods

* [configure](_datastore_.datastore.md#configure)
* [configureCache](_datastore_.datastore.md#configurecache)
* [create](_datastore_.datastore.md#create)
* [exists](_datastore_.datastore.md#exists)
* [get](_datastore_.datastore.md#get)
* [getKey](_datastore_.datastore.md#getkey)
* [getLockKey](_datastore_.datastore.md#private-getlockkey)
* [getOrThrow](_datastore_.datastore.md#getorthrow)
* [getQuery](_datastore_.datastore.md#private-getquery)
* [internalGet](_datastore_.datastore.md#private-internalget)
* [internalGetOrThrow](_datastore_.datastore.md#private-internalgetorthrow)
* [internalRemove](_datastore_.datastore.md#private-internalremove)
* [patch](_datastore_.datastore.md#patch)
* [query](_datastore_.datastore.md#query)
* [rawGet](_datastore_.datastore.md#rawget)
* [rawQuery](_datastore_.datastore.md#rawquery)
* [remove](_datastore_.datastore.md#remove)
* [removeByQuery](_datastore_.datastore.md#removebyquery)
* [update](_datastore_.datastore.md#update)
* [cleanModel](_datastore_.datastore.md#static-private-cleanmodel)

## Constructors

###  constructor

\+ **new Datastore**(`services`: [ServicesInterface](../interfaces/_datastore_.servicesinterface.md), `config?`: [ConfigInterface](../interfaces/_datastore_.configinterface.md)): *[Datastore](_datastore_.datastore.md)*

*Overrides void*

*Defined in [datastore.ts:114](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`services` | [ServicesInterface](../interfaces/_datastore_.servicesinterface.md) |
`config?` | [ConfigInterface](../interfaces/_datastore_.configinterface.md) |

**Returns:** *[Datastore](_datastore_.datastore.md)*

## Properties

### `Private` `Optional` config

• **config**? : *[DatastoreConfigInterface](../interfaces/_datastore_.datastoreconfiginterface.md)‹T›*

*Defined in [datastore.ts:157](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L157)*

___

###  patchLock

• **patchLock**: *Redlock*

*Defined in [datastore.ts:114](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L114)*

___

###  services

• **services**: *[InternalServicesInterface](../interfaces/_datastore_.internalservicesinterface.md)*

*Defined in [datastore.ts:155](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L155)*

## Accessors

###  cache

• **get cache**(): *CacheInterface‹T›*

*Inherited from [Datastore](_datastore_.datastore.md).[cache](_datastore_.datastore.md#cache)*

Defined in node_modules/@ehacke/redis/dist/cached.d.ts:31

Cache getter

**Returns:** *CacheInterface‹T›*

## Methods

###  configure

▸ **configure**(`config`: [DatastoreConfigInterface](../interfaces/_datastore_.datastoreconfiginterface.md)‹T›, `cacheConfig?`: [DatastoreCacheConfigInterface](../interfaces/_datastore_.datastorecacheconfiginterface.md)‹T›): *void*

*Defined in [datastore.ts:144](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L144)*

Configure datastore

**Parameters:**

Name | Type |
------ | ------ |
`config` | [DatastoreConfigInterface](../interfaces/_datastore_.datastoreconfiginterface.md)‹T› |
`cacheConfig?` | [DatastoreCacheConfigInterface](../interfaces/_datastore_.datastorecacheconfiginterface.md)‹T› |

**Returns:** *void*

___

###  configureCache

▸ **configureCache**(`services`: [ServicesInterface](../interfaces/_datastore_.servicesinterface.md), `config`: [ConfigInterface](../interfaces/_datastore_.configinterface.md)‹T›): *void*

*Inherited from [Datastore](_datastore_.datastore.md).[configureCache](_datastore_.datastore.md#configurecache)*

Defined in node_modules/@ehacke/redis/dist/cached.d.ts:26

Initialize cache configuration

**Parameters:**

Name | Type |
------ | ------ |
`services` | [ServicesInterface](../interfaces/_datastore_.servicesinterface.md) |
`config` | [ConfigInterface](../interfaces/_datastore_.configinterface.md)‹T› |

**Returns:** *void*

___

###  create

▸ **create**(`instance`: T): *Promise‹T›*

*Defined in [datastore.ts:209](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L209)*

Create instance of model in db

**Parameters:**

Name | Type |
------ | ------ |
`instance` | T |

**Returns:** *Promise‹T›*

___

###  exists

▸ **exists**(`id`: string): *Promise‹boolean›*

*Defined in [datastore.ts:411](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L411)*

Model exists

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹boolean›*

___

###  get

▸ **get**(`id`: string): *Promise‹T | null›*

*Defined in [datastore.ts:249](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L249)*

Get instance

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹T | null›*

___

###  getKey

▸ **getKey**(`id`: string): *Key*

*Defined in [datastore.ts:268](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L268)*

Get datastore key based on id

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Key*

___

### `Private` getLockKey

▸ **getLockKey**(`id`: string): *string*

*Defined in [datastore.ts:337](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L337)*

Get lock key

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *string*

___

###  getOrThrow

▸ **getOrThrow**(`id`: string, `throw404`: boolean): *Promise‹T›*

*Defined in [datastore.ts:311](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L311)*

Get instance or throw

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`throw404` | boolean | false |

**Returns:** *Promise‹T›*

___

### `Private` getQuery

▸ **getQuery**(`query`: [QueryInterface](../interfaces/_datastore_.queryinterface.md)): *Query*

*Defined in [datastore.ts:178](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L178)*

Build datastore query from structured query

**Parameters:**

Name | Type |
------ | ------ |
`query` | [QueryInterface](../interfaces/_datastore_.queryinterface.md) |

**Returns:** *Query*

___

### `Private` internalGet

▸ **internalGet**(`id`: string): *Promise‹T | null›*

*Defined in [datastore.ts:278](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L278)*

Get instance without touching cache

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹T | null›*

___

### `Private` internalGetOrThrow

▸ **internalGetOrThrow**(`id`: string, `throw404`: boolean): *Promise‹T›*

*Defined in [datastore.ts:326](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L326)*

Internal get or throw without touching cache

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`throw404` | boolean | false |

**Returns:** *Promise‹T›*

___

### `Private` internalRemove

▸ **internalRemove**(`id`: string): *Promise‹void›*

*Defined in [datastore.ts:431](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L431)*

Remove model without touching cache

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹void›*

___

###  patch

▸ **patch**(`id`: string, `patchUpdate`: DeepPartial‹T›, `curDate`: Date): *Promise‹T›*

*Defined in [datastore.ts:349](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L349)*

Update properties of model

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`patchUpdate` | DeepPartial‹T› | - |
`curDate` | Date | DateTime.utc().toJSDate() |

**Returns:** *Promise‹T›*

___

###  query

▸ **query**(`query`: [QueryInterface](../interfaces/_datastore_.queryinterface.md)): *Promise‹T[]›*

*Defined in [datastore.ts:469](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L469)*

List models satisfying query

**Parameters:**

Name | Type |
------ | ------ |
`query` | [QueryInterface](../interfaces/_datastore_.queryinterface.md) |

**Returns:** *Promise‹T[]›*

___

###  rawGet

▸ **rawGet**(`id`: string): *Promise‹any | null›*

*Defined in [datastore.ts:298](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L298)*

Get value directly from the db, by-passing cache and convertFromDb

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹any | null›*

___

###  rawQuery

▸ **rawQuery**(`query`: [QueryInterface](../interfaces/_datastore_.queryinterface.md)): *Promise‹any[]›*

*Defined in [datastore.ts:492](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L492)*

Get value directly from the db, by-passing cache and convertFromDb

**Parameters:**

Name | Type |
------ | ------ |
`query` | [QueryInterface](../interfaces/_datastore_.queryinterface.md) |

**Returns:** *Promise‹any[]›*

___

###  remove

▸ **remove**(`id`: string): *Promise‹void›*

*Defined in [datastore.ts:420](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L420)*

Remove model

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *Promise‹void›*

___

###  removeByQuery

▸ **removeByQuery**(`query`: [QueryInterface](../interfaces/_datastore_.queryinterface.md)): *Promise‹string[]›*

*Defined in [datastore.ts:506](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L506)*

Remove by query

**Parameters:**

Name | Type |
------ | ------ |
`query` | [QueryInterface](../interfaces/_datastore_.queryinterface.md) |

**Returns:** *Promise‹string[]›*

___

###  update

▸ **update**(`id`: string, `instance`: T, `curDate`: Date): *Promise‹T›*

*Defined in [datastore.ts:444](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L444)*

Overwrite model

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`id` | string | - |
`instance` | T | - |
`curDate` | Date | DateTime.utc().toJSDate() |

**Returns:** *Promise‹T›*

___

### `Static` `Private` cleanModel

▸ **cleanModel**(`model`: object): *object*

*Defined in [datastore.ts:164](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L164)*

Clean model of common properties that shouldn't be written

**Parameters:**

Name | Type |
------ | ------ |
`model` | object |

**Returns:** *object*

* \[ **k**: *string*\]: any
