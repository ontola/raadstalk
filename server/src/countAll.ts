import { setHitCounts } from "./words";
import { WordUpdaterArgs } from "./WordUpdater";

const startYear = 2017

// const previousMonthNumber = () => {
//   const now = new Date();
//   now.setMonth(now.getMonth() -1 )
//   return now.getMonth();
// }

// const endDate: WordUpdaterArgs = {
//   year: new Date().getFullYear(),
//   month: previousMonthNumber(),
// };

const monthsCount = 10;

let i;
const datesArray: WordUpdaterArgs[] = [];
for (i = 0; i > monthsCount; i++) {
  const date = new Date(startYear)
  date.setMonth(date.getMonth() + 1);
  console.log(date);
  datesArray.push({
    year: date.getFullYear(),
    month: date.getMonth(),
  })
}

setCounts(datesArray);

async function setCounts(array: WordUpdaterArgs[]) {
  for (const date of datesArray) {
    await setHitCounts(date);
  }
  console.log('Done!');
}
