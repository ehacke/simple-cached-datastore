import { Redis } from "@ehacke/redis";

const redis = {
  createRedlock: () => ({ lock: async () => ({ unlock: async () => undefined }) }),
} as unknown as Redis;

export default redis;
