import nodeFetch from "node-fetch";

import { esURL } from "./config";
import { PopularTerm } from "../../types";
import { errorHandler } from "./error";

class WordCounter {
  public getCounts(words: string[]): Promise<PopularTerm[]> {
    const wordCounts = words.map(word => this.getCount(word));

    return Promise
      .all(wordCounts)
      .then((counts: number[]) =>
        words.map((word, index) => ({
          label: word,
          hitCount: counts[index],
        }),
      ))
      .catch((e: Error) => {
        errorHandler(e);
        return [{
          label: "Error while getting counts!",
          hitCount: 0,
        }];
      });
  }

  private getCount(word: string): Promise<number> {
    return nodeFetch(esURL, {
      method: "POST",
      body: JSON.stringify(this.query(word)),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(json => json.hits.total.value)
      .catch((e) => {
        console.error(`Can't getCount for ${word}`, e);
        return -1;
      });
  }

  private query(word: string) {
    return {
      query: {
        simple_query_string: {
          query: word,
          fields: ["text", "title", "description"],
          default_operator: "and",
        },
      },
    };
  }
}

export default WordCounter;
