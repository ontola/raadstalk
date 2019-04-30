import ioredis, { Redis } from "ioredis";
import { PopularTerm, YearMonth } from "../../types";
import { errorHandler } from "./error";

const namespace = "raadstalk";

class WordUpdater {
  private redis: Redis;
  // E.g. 2019-01
  private monthIndex: string;

  constructor({
    year,
    month,
  }: YearMonth) {
    this.redis = new ioredis(6379, "redis");

    const normalizedMonth = (month || new Date().getMonth()).toString().padStart(2, "0");
    this.monthIndex = `${namespace}.${year || new Date().getFullYear()}-${normalizedMonth}`;
  }

  public getWords(): Promise<string[]> {
    return this
      .redis
      .lrange(this.monthIndex, 0, 20)
      .then((result: string[]) => result)
      .catch((e) => {
        errorHandler(e);
        return [];
      });
  }

  public setWordCounts(wordCounts: PopularTerm[]): Promise<void> {
    const keyValueList = wordCounts.reduce(
      (acc, wordCount) => ({
        ...acc,
        [this.labelKey(wordCount.label)]: wordCount.hitCount,
      }),
      {},
    );

    return this
      .redis
      .mset(keyValueList)
      .catch(errorHandler);
  }

  public getWordCounts(): Promise<PopularTerm[]> {
    return this
      .getWords()
      .then((words: string[]) => this
        .redis
        .mget(...words.map(s => this.labelKey(s)))
        .then((counts: number[]) =>
          words.map((word, i) => ({
            hitCount: counts[i],
            label: word,
          }),
        ))
      .catch(errorHandler),
    );
  }

  private labelKey(label: string) {
    return `${this.monthIndex}.counts.${label}`;
  }
}

export default WordUpdater;
