import { expect } from 'chai';
import { DateTime } from 'luxon';
import sinon from 'sinon';

import { Datastore, FILTER_OPERATORS } from '../datastore';
import datastore from './datastore';
import redis from './mockRedis';

class TestClass {
  constructor(params) {
    this.id = params.id;
    this.foo = params.foo;
    this.bar = params.bar;
    this.deep = params.deep;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  id: string;

  foo: string;

  bar: string;

  deep: {
    thing1: string;
    thing2: string;
  };

  createdAt: Date;

  updatedAt: Date;

  validate() {
    return true;
  }

  getDalSchema() {
    return {
      excludeFromIndexes: [],
    };
  }
}

const config = {
  collection: 'collection-foo',
  convertFromDb: (params) => new TestClass(params),
  convertForDb: (params) => params,
};

const defaultServices = {
  datastore,
  redis,
};

const resetSpies = (spied) => {
  spied.get.resetHistory();
  spied.set.resetHistory();
  spied.del.resetHistory();
  spied.setList.resetHistory();
  spied.getList.resetHistory();
  spied.delList.resetHistory();
  spied.delLists.resetHistory();
};

describe('datastore integration tests', function() {
  this.timeout(5000);

  beforeEach(async () => datastore.reset());

  afterEach(() => sinon.restore());

  it('create model in db', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);

    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
      updatedAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
    });

    const created = await ds.create(testInstance);

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(1);
    expect(spied.del.callCount).to.eql(1);
    expect(spied.setList.callCount).to.eql(0);
    expect(spied.getList.callCount).to.eql(0);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(2);

    const found = await ds.getOrThrow(testInstance.id);

    expect(found).to.eql(created);
    expect(found).to.eql(testInstance);
  });

  it('dont create model in db if createdAt or updatedAt is not Date', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
      updatedAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
    });

    // @ts-ignore
    testInstance.createdAt = '2019-01-01T00:00:00.000Z';

    let result = await ds
      .create(testInstance)
      .then(() => null)
      .catch((error) => error);
    expect(result && result.message).to.eql('createdAt must be a Date');

    testInstance.createdAt = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();
    // @ts-ignore
    testInstance.updatedAt = '2019-01-01T00:00:00.000Z';

    result = await ds
      .create(testInstance)
      .then(() => null)
      .catch((error) => error);
    expect(result && result.message).to.eql('updatedAt must be a Date');
  });

  it('patch deep model in db', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const curDate = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      deep: {
        thing1: '1',
        thing2: '2',
      },
      createdAt: curDate,
      updatedAt: curDate,
    });

    const created = await ds.create(testInstance);
    resetSpies(spied);
    const updated = await ds.patch(created.id, { foo: 'new-foo', deep: { thing2: '9' } }, curDate);

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(1);
    expect(spied.del.callCount).to.eql(1);
    expect(spied.setList.callCount).to.eql(0);
    expect(spied.getList.callCount).to.eql(0);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(2);

    const found = await ds.getOrThrow(testInstance.id);

    expect(updated.foo).to.eql('new-foo');
    expect(updated.bar).to.eql('baz');
    expect(updated.deep).to.eql({
      thing1: '1',
      thing2: '9',
    });
    expect(found).to.eql(updated);
  });

  it('update', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const curDate = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: curDate,
      updatedAt: curDate,
    });

    const created = await ds.create(testInstance);
    resetSpies(spied);
    const updated = await ds.update(created.id, new TestClass({ ...testInstance, foo: 'new-foo' }), curDate);

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(1);
    expect(spied.del.callCount).to.eql(2);
    expect(spied.setList.callCount).to.eql(0);
    expect(spied.getList.callCount).to.eql(0);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(2);

    const found = await ds.getOrThrow(testInstance.id);

    expect(updated.foo).to.eql('new-foo');
    expect(updated.bar).to.eql('baz');
    expect(found).to.eql(updated);
  });

  it('remove', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const curDate = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: curDate,
      updatedAt: curDate,
    });

    const created = await ds.create(testInstance);
    resetSpies(spied);
    await ds.remove(created.id);

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(0);
    expect(spied.del.callCount).to.eql(1);
    expect(spied.setList.callCount).to.eql(0);
    expect(spied.getList.callCount).to.eql(0);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(1);

    const found = await ds.get(created.id);

    await ds.remove(created.id);

    expect(found).to.eql(null);
  });

  it('list', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
      updatedAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
    });

    const created = [] as any[];

    created.push(await ds.create(testInstance));
    created.push(await ds.create(new TestClass({ ...testInstance, id: '2', foo: 'another' })));
    created.sort((a, b) => a.id.localeCompare(b.id));

    resetSpies(spied);

    const found = await ds.query({});
    found.sort((a, b) => a.id.localeCompare(b.id));

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(0);
    expect(spied.del.callCount).to.eql(0);
    expect(spied.setList.callCount).to.eql(1);
    expect(spied.getList.callCount).to.eql(1);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(0);

    expect(found.length).to.eql(2);
    expect(found).to.eql(created);
  });

  it('list with filters', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      createdAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
      updatedAt: DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate(),
    });

    const created = [] as any[];

    created.push(await ds.create(testInstance));
    created.push(await ds.create(new TestClass({ ...testInstance, id: '2', foo: 'another' })));

    resetSpies(spied);

    const found = await ds.query({ filters: [{ property: 'foo', operator: FILTER_OPERATORS.EQ, value: 'something' }] });
    found.sort((a, b) => a.id.localeCompare(b.id));

    expect(spied.get.callCount).to.eql(0);
    expect(spied.set.callCount).to.eql(0);
    expect(spied.del.callCount).to.eql(0);
    expect(spied.setList.callCount).to.eql(1);
    expect(spied.getList.callCount).to.eql(1);
    expect(spied.delList.callCount).to.eql(0);
    expect(spied.delLists.callCount).to.eql(0);

    expect(found.length).to.eql(1);
    expect(found).to.eql([testInstance]);
  });

  it('patch gets lock and unlocks', async () => {
    const lock = { unlock: sinon.stub().resolves() };
    const redlock = { lock: sinon.stub().resolves(lock) };

    const services = {
      ...defaultServices,
      redis: { createRedlock: sinon.stub().returns(redlock) } as any,
    };
    const ds = new Datastore<TestClass>(services);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const curDate = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      deep: {
        thing1: '1',
        thing2: '2',
      },
      createdAt: curDate,
      updatedAt: curDate,
    });

    const created = await ds.create(testInstance);
    resetSpies(spied);
    const updated = await ds.patch(created.id, { foo: 'new-foo', deep: { thing2: '9' } }, curDate);

    const found = await ds.getOrThrow(testInstance.id);

    expect(found).to.eql(updated);
    expect(services.redis.createRedlock.args).to.eql([
      [
        {
          retryCount: 15,
          retryDelay: 150,
          retryJitter: 30,
        },
      ],
    ]);

    expect(lock.unlock.callCount).to.eql(1);
    expect(redlock.lock.args).to.eql([['datastore-collection-foofoo-id', 5000]]);
  });

  it('patch gets unlocks on throw', async () => {
    const lock = { unlock: sinon.stub().resolves() };
    const redlock = { lock: sinon.stub().resolves(lock) };

    const services = {
      ...defaultServices,
      redis: { createRedlock: sinon.stub().returns(redlock) } as any,
    };
    const ds = new Datastore<TestClass>(services);
    ds.configure(config);
    // @ts-ignore
    const spied = sinon.spy<Cache>(ds.cache);

    const curDate = DateTime.fromISO('2019-01-01T00:00:00.000Z').toJSDate();

    const testInstance = new TestClass({
      id: 'foo-id',
      foo: 'something',
      bar: 'baz',
      deep: {
        thing1: '1',
        thing2: '2',
      },
      createdAt: curDate,
      updatedAt: curDate,
    });

    const created = await ds.create(testInstance);
    resetSpies(spied);
    sinon.stub(ds.services.datastore, 'transaction').throws(new Error('boom'));
    const updated = await ds.patch(created.id, { foo: 'new-foo', deep: { thing2: '9' } }, curDate).catch((error) => error.message);

    expect(updated).to.eql('boom');
    expect(services.redis.createRedlock.args).to.eql([
      [
        {
          retryCount: 15,
          retryDelay: 150,
          retryJitter: 30,
        },
      ],
    ]);

    expect(lock.unlock.callCount).to.eql(1);
    expect(redlock.lock.args).to.eql([['datastore-collection-foofoo-id', 5000]]);
  });

  it('rawGet returns null for missing objects', async () => {
    const ds = new Datastore<TestClass>(defaultServices);
    ds.configure(config);

    const thing = await ds.rawGet('missing');
    expect(thing).to.eql(null);
  });
});
