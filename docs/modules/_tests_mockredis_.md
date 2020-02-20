[simple-cached-datastore](../README.md) › ["tests/mockRedis"](_tests_mockredis_.md)

# External module: "tests/mockRedis"

## Index

### Variables

* [redis](_tests_mockredis_.md#const-redis)

## Variables

### `Const` redis

• **redis**: *any* = {
  duplicate: () => redis,
  createRedlock: () => ({ lock: async () => ({ unlock: async () => undefined }) }),
} as any

*Defined in [tests/mockRedis.ts:1](https://github.com/ehacke/simple-cached-datastore/blob/ff2b7ee/tests/mockRedis.ts#L1)*
