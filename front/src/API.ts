import { ListItemType } from "../../types";
import { number, string } from "prop-types";

export function getSearchResults(query: string): Promise<ListItemType[]> {
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
    mode: "cors",
    credentials: "same-origin",
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(json => bucketsToListItems(json.aggregations.municipalities.buckets));
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
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
  })
  .then(response => response.json());
}
