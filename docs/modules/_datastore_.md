[simple-cached-datastore](../README.md) › ["datastore"](_datastore_.md)

# External module: "datastore"

## Index

### Enumerations

* [FILTER_OPERATORS](../enums/_datastore_.filter_operators.md)
* [SORT_DIRECTION](../enums/_datastore_.sort_direction.md)

### Classes

* [Datastore](../classes/_datastore_.datastore.md)

### Interfaces

* [ConfigInterface](../interfaces/_datastore_.configinterface.md)
* [DalModel](../interfaces/_datastore_.dalmodel.md)
* [DalSchema](../interfaces/_datastore_.dalschema.md)
* [DatastoreCacheConfigInterface](../interfaces/_datastore_.datastorecacheconfiginterface.md)
* [DatastoreConfigInterface](../interfaces/_datastore_.datastoreconfiginterface.md)
* [InternalServicesInterface](../interfaces/_datastore_.internalservicesinterface.md)
* [ListFilterInterface](../interfaces/_datastore_.listfilterinterface.md)
* [ListSortInterface](../interfaces/_datastore_.listsortinterface.md)
* [QueryInterface](../interfaces/_datastore_.queryinterface.md)
* [ServicesInterface](../interfaces/_datastore_.servicesinterface.md)

### Type aliases

* [DalModelValue](_datastore_.md#dalmodelvalue)

### Variables

* [CONFIG_ERROR](_datastore_.md#const-config_error)
* [log](_datastore_.md#const-log)

### Object literals

* [CLEAN_CONFIG](_datastore_.md#const-clean_config)
* [CONSTANTS](_datastore_.md#const-constants)

## Type aliases

###  DalModelValue

Ƭ **DalModelValue**: *string | Date | number | null | boolean*

*Defined in [datastore.ts:27](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L27)*

## Variables

### `Const` CONFIG_ERROR

• **CONFIG_ERROR**: *"datastore instance not configured"* = "datastore instance not configured"

*Defined in [datastore.ts:100](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L100)*

___

### `Const` log

• **log**: *BaseLogger‹› & object* = pino({ prettyPrint: true })

*Defined in [datastore.ts:16](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L16)*

## Object literals

### `Const` CLEAN_CONFIG

### ▪ **CLEAN_CONFIG**: *object*

*Defined in [datastore.ts:92](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L92)*

###  emptyArrays

• **emptyArrays**: *boolean* = false

*Defined in [datastore.ts:93](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L93)*

###  emptyObjects

• **emptyObjects**: *boolean* = false

*Defined in [datastore.ts:94](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L94)*

###  emptyStrings

• **emptyStrings**: *boolean* = false

*Defined in [datastore.ts:95](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L95)*

###  nullValues

• **nullValues**: *boolean* = false

*Defined in [datastore.ts:96](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L96)*

###  undefinedValues

• **undefinedValues**: *boolean* = true

*Defined in [datastore.ts:97](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L97)*

___

### `Const` CONSTANTS

### ▪ **CONSTANTS**: *object*

*Defined in [datastore.ts:102](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L102)*

###  LOCK_DELAY_MS

• **LOCK_DELAY_MS**: *number* = 150

*Defined in [datastore.ts:104](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L104)*

###  LOCK_PREFIX

• **LOCK_PREFIX**: *string* = "datastore-"

*Defined in [datastore.ts:107](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L107)*

###  LOCK_TTL_MS

• **LOCK_TTL_MS**: *number* = 5000

*Defined in [datastore.ts:106](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L106)*

###  MAX_LOCK_ATTEMPTS

• **MAX_LOCK_ATTEMPTS**: *number* = 15

*Defined in [datastore.ts:103](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L103)*

###  RETRY_JITTER_MS

• **RETRY_JITTER_MS**: *number* = 30

*Defined in [datastore.ts:105](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/datastore.ts#L105)*
