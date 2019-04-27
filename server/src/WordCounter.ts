import nodeFetch from "node-fetch";

import { oriURL } from "./config";
import { PopularTerm } from "../../types";

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
      ));
  }

  private getCount(word: string): Promise<number> {
    return nodeFetch(oriURL, { method: "POST", body: JSON.stringify(this.query(word)) })
      .then(response => response.json())
      .then(json => json.hits.total)
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
