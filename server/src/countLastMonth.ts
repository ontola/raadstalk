import { setHitCounts } from "./words";
import { YearMonth } from "../../types";

export const getPreviousMonth = (): YearMonth => {
  const now = new Date();
  now.setDate(1);
  now.setMonth(now.getMonth() - 1);

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

console.log(`Counting all words for ${JSON.stringify(getPreviousMonth())}`);
setHitCounts(getPreviousMonth());
