import { YearMonth } from "../../../types";

export const addMonth = (date: YearMonth): YearMonth => {
  const DATE = yearMonthToDate(date);
  DATE.setMonth(DATE.getMonth() + 1);
  return dateToYearMonth(DATE);
};

export const subtractMonth = (date: YearMonth): YearMonth => {
  const DATE = yearMonthToDate(date);
  DATE.setMonth(DATE.getMonth() - 1);
  return dateToYearMonth(DATE);
};

export const startDate: YearMonth = {
  year: 2017,
  month: 1,
};

export const getPreviousMonth = () => {
  const now = new Date();
  now.setDate(1);
  now.setMonth(now.getMonth() - 1);

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

export const yearMonthToDate = (yearMonth: YearMonth): Date => {
  const date = new Date();
  date.setDate(1);
  date.setMonth(yearMonth.month - 1);
  date.setFullYear(yearMonth.year);
  return date;
};

export const dateToYearMonth = (date: Date): YearMonth => {
  const yearMonth = {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
  return yearMonth;
};
