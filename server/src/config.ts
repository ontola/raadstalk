import dotenv from "dotenv";

const envs = dotenv.config();

if (envs.error) {
  console.log("Error when loading .env:", envs.error);
}

// All defaults should be production values

export const esURL = process.env.ES_URL ||
  "https://api.openraadsinformatie.nl/v1/elastic/ori_*/_search/";
export const port = process.env.APP_PORT || 8080;
export const redisHost = process.env.REDIS_HOST || "redis";
export const redisPort = Number(process.env.REDIS_PORT) || 6379;
export const staticDir = process.env.WWW_DIR || "/usr/src/app/www/";
export const startYear = Number(process.env.START_YEAR || 2018);
export const startMonth = Number(process.env.START_MONTH || 1);
