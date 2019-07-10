import { PopularTerm, SearchResultsType, Aggregate, YearMonth } from "../../types";
import { bugsnagClient } from "./index";

export function getSearchResults(query: string): Promise<SearchResultsType> {
  const data = {
    query: {
      bool: {
        must: [
          [
            {
              simple_query_string: {
                query,
                fields: [
                  "text",
                  "title",
                  "description",
                  "name",
                ],
                default_operator: "or",
              },
            },
          ],
          // TODO: Make this flexible when all data is loaded
          // {
          //   range: {
          //     date_modified: {
          //       gte: "2019-04-01",
          //       lte: "2019-04-30",
          //     },
          //   },
          // },
        ],
      },
    },
    aggs: {
      municipalities: {
        terms: {
          field : "_index",
        },
      },
    },
    from: 0,
    size: 100,
  };

  return fetch("/search", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json => convertJSON(json))
  .catch((e) => {
    bugsnagClient.notify(e);
    return {
      items: [],
      count: 0,
      error: e,
    };
  });
}

function convertJSON(json: any): SearchResultsType {
  const results: SearchResultsType = {
    count: json.hits.total.value,
    items: bucketsToListItems(json.aggregations.municipalities.buckets),
  };

  return results;
}

interface ElasticBucket {
  doc_count: number;
  key: string;
}

function bucketsToListItems(items: ElasticBucket[]): Aggregate[] {
  return items.map((item) => {
    const parts = item.key.split("_");
    const label = parts
      .slice(1, parts.length - 1)
      .map(s => `${s.charAt(0).toLocaleUpperCase()}${s.substring(1)}`)
      .join(" ");

    return {
      label,
      oriKey: item.key,
      hitCount: item.doc_count,
    };
  });
}

export function getPopularItems(date: YearMonth): Promise<PopularTerm[]> {
  return fetch(`/popular/${date.year.toString()}-${date.month.toString().padStart(2, "0")}`, {
    method: "GET",
    credentials: "same-origin",
  })
  .then(response => response.json());
}
