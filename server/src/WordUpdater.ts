import ioredis, { Redis } from "ioredis";
import { PopularTerm, YearMonth } from "../../types";
import { errorHandler } from "./error";
import { redisPort, redisHost } from "./config";

const namespace = "raadstalk";

const redisOptions = {
  port: redisPort,
  host: redisHost,
};

class WordUpdater {
  private redis: Redis;
  // E.g. 2019-01
  private monthIndex: string;

  constructor({
    year,
    month,
  }: YearMonth) {
    this.redis = new ioredis(redisOptions);

    const normalizedMonth = (month || new Date().getMonth()).toString().padStart(2, "0");
    this.monthIndex = `${namespace}.${year || new Date().getFullYear()}-${normalizedMonth}`;
  }

  public getWords(): Promise<string[]> {
    return this
      .redis
      .lrange(this.monthIndex, 0, 20)
      .then((result: string[]) => {
        if (result.length === 0) {
          throw Error(`No words found for ${this.monthIndex}`);
        }
        return result;
      })
      .catch((e: Error) => {
        errorHandler(e);
        return [e.message];
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
