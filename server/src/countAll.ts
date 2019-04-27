import { setHitCounts } from "./words";
import { WordUpdaterArgs } from "./WordUpdater";

// Should start the getCounts process for all months up until the last one.

const startYear = 2017;
const startMonth = 0;
const monthsCount = 20;

let i;
const datesArray: WordUpdaterArgs[] = [];
const date = new Date();
date.setFullYear(startYear);
date.setMonth(startMonth);

for (i = 0; i < monthsCount; i += 1) {
  datesArray.push({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  });
  date.setMonth(date.getMonth() + 1);
}

setCounts(datesArray)
.then(() => console.log("All words counted"))
.catch(e => console.error(e));

async function setCounts(array: WordUpdaterArgs[]) {
  console.log("Setting counts for:", array);
  for (const date of datesArray) {
    await setHitCounts(date);
  }
}
