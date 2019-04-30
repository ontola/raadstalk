import WordUpdater from "./WordUpdater";
import WordCounter from "./WordCounter";
import { YearMonth } from "../../types";
import { errorHandler } from "./error";

export const setHitCounts = async (date: YearMonth) => {
  const wordUpdater = new WordUpdater(date);
  const wordList = await wordUpdater.getWords();
  const wordCounts = await new WordCounter().getCounts(wordList);
  await wordUpdater.setWordCounts(wordCounts).catch(errorHandler);
};
