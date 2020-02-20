[simple-cached-datastore](../README.md) › ["datastore"](../modules/_datastore_.md) › [DatastoreCacheConfigInterface](_datastore_.datastorecacheconfiginterface.md)

# Interface: DatastoreCacheConfigInterface <**T**>

## Type parameters

▪ **T**: *[DalModel](_datastore_.dalmodel.md)*

## Hierarchy

* **DatastoreCacheConfigInterface**

## Index

### Properties

* [cacheTtlSec](_datastore_.datastorecacheconfiginterface.md#cachettlsec)

### Methods

* [parseFromCache](_datastore_.datastorecacheconfiginterface.md#parsefromcache)
* [stringifyForCache](_datastore_.datastorecacheconfiginterface.md#stringifyforcache)

## Properties

###  cacheTtlSec

• **cacheTtlSec**: *number*

*Defined in [datastore.ts:87](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L87)*

## Methods

###  parseFromCache

▸ **parseFromCache**(`instance`: string): *Promise‹T› | T*

*Defined in [datastore.ts:89](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L89)*

**Parameters:**

Name | Type |
------ | ------ |
`instance` | string |

**Returns:** *Promise‹T› | T*

___

###  stringifyForCache

▸ **stringifyForCache**(`instance`: T): *Promise‹string› | string*

*Defined in [datastore.ts:88](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`instance` | T |

**Returns:** *Promise‹string› | string*
