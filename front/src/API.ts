import { ListItemType, SearchResultsType } from "../../types";
import { SearchResponse } from "elasticsearch";

export function getSearchResults(query: string): Promise<SearchResultsType> {
  const data = {
    query: {
      match: {
        description: query,
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
    size: 10,
  };

  return fetch("/search", {
    method: "POST",
    credentials: "same-origin",
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json => convertJSON(json));
}

function convertJSON(json: SearchResponse<any>): SearchResultsType {
  const results: SearchResultsType = {
    count: json.hits.total,
    items: bucketsToListItems(json.aggregations.municipalities.buckets),
  };

  return results;
}

interface ElasticBucket {
  doc_count: number;
  key: string;
}

function bucketsToListItems(items: ElasticBucket[]): ListItemType[] {
  return items.map((item) => {
    const parts = item.key.split("_");
    const label = parts
      .slice(1, parts.length - 1)
      .map(s => `${s.charAt(0).toLocaleUpperCase()}${s.substring(1)}`)
      .join(" ");

    return {
      label,
      hitCount: item.doc_count,
    };
  });
}

export function getPopularItems(): Promise<ListItemType[]> {
  return fetch("/popular", {
    method: "GET",
    credentials: "same-origin",
  })
  .then(response => response.json());
}
