import { createClient } from "redis";
import { ENV } from "./env";
import logger  from "../utils/logger";

export const redisClient = createClient({ url: ENV.REDIS_URL });

redisClient.on("error", (err) => logger.error("❌ Redis Error:", err));

export const connectRedis = async () => {
  await redisClient.connect();
  logger.info("✅ Redis connected successfully!");
};


