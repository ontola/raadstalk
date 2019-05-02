import dotenv from "dotenv";

const envs = dotenv.config();

if (envs.error) {
  console.log("Error when loading .env:", envs.error);
}

export const oriURL = process.env.ORI_URL ||
  "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search/";
export const redisHost = process.env.REDIS_HOST || "redis";
export const redisPort = Number(process.env.REDIS_PORT) || 6379;
