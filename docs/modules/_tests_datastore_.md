[simple-cached-datastore](../README.md) › ["tests/datastore"](_tests_datastore_.md)

# External module: "tests/datastore"

## Index

### Variables

* [datastore](_tests_datastore_.md#const-datastore)
* [host](_tests_datastore_.md#const-host)

## Variables

### `Const` datastore

• **datastore**: *Datastore‹›* = new Datastore({ namespace: 'testing', apiEndpoint: host, projectId: 'roleup-dev' })

*Defined in [tests/datastore.ts:9](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/tests/datastore.ts#L9)*

___

### `Const` host

• **host**: *string* = getenv('DATABASE_URL')

*Defined in [tests/datastore.ts:7](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/tests/datastore.ts#L7)*
