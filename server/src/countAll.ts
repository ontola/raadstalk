import { setHitCounts } from "./words";
import { YearMonth } from "../../types";
import { getPreviousMonth } from "./countLastMonth";
import { startYear, startMonth } from "./config";

// Should start the getCounts process for all months up until the last one.

const endDate = getPreviousMonth();

const datesArray: YearMonth[] = [];
const date = new Date();
date.setFullYear(startYear);
// JS starts with 0
date.setMonth(startMonth - 1);

while (JSON.stringify(datesArray[datesArray.length - 1]) !== JSON.stringify(endDate)) {
  console.log(datesArray[datesArray.length - 1], endDate);
  datesArray.push({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });
  date.setMonth(date.getMonth() + 1);
}

setCounts(datesArray)
.then(() => console.log("All words counted"))
.catch(e => console.error(e));

async function setCounts(array: YearMonth[]) {
  console.log("Setting counts for:", array);
  for (const date of datesArray) {
    await setHitCounts(date);
  }
}
