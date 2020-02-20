[simple-cached-datastore](../README.md) › ["datastore"](../modules/_datastore_.md) › [DatastoreConfigInterface](_datastore_.datastoreconfiginterface.md)

# Interface: DatastoreConfigInterface <**T**>

## Type parameters

▪ **T**: *[DalModel](_datastore_.dalmodel.md)*

## Hierarchy

* **DatastoreConfigInterface**

## Index

### Properties

* [collection](_datastore_.datastoreconfiginterface.md#collection)

### Methods

* [convertForDb](_datastore_.datastoreconfiginterface.md#convertfordb)
* [convertFromDb](_datastore_.datastoreconfiginterface.md#convertfromdb)

## Properties

###  collection

• **collection**: *string*

*Defined in [datastore.ts:81](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L81)*

## Methods

###  convertForDb

▸ **convertForDb**(`instance`: DeepPartial‹T›): *any*

*Defined in [datastore.ts:82](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L82)*

**Parameters:**

Name | Type |
------ | ------ |
`instance` | DeepPartial‹T› |

**Returns:** *any*

___

###  convertFromDb

▸ **convertFromDb**(`params`: any): *T | Promise‹T›*

*Defined in [datastore.ts:83](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |

**Returns:** *T | Promise‹T›*
