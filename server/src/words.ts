import WordUpdater, { WordUpdaterArgs } from "./WordUpdater";
import WordCounter from "./WordCounter";

export const setHitCounts = async (date: WordUpdaterArgs) => {
  const wordUpdater = new WordUpdater(date);
  const wordList = await wordUpdater.getWords();
  const wordCounts = await new WordCounter().getCounts(wordList);
  await wordUpdater.setWordCounts(wordCounts);
};
