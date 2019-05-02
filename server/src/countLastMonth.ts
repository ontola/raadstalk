import { setHitCounts } from "./words";

const now = new Date();

const date = {
  year: now.getFullYear(),
  month: now.getMonth() - 1,
};

console.log(`Counting all words for ${JSON.stringify(date)}`);
setHitCounts(date);
