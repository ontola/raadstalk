import { ListItemType } from "./types";
import { number, string } from "prop-types";

export function getSearchResults(query: string): Promise<ListItemType[] | null> {
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

const mockMunicipalitiesHits: ListItemType[] = [
  {
    label: "Amsterdam",
    hitCount: 23,
  },  {
    label: "Utrecht",
    hitCount: 18,
  },  {
    label: "Almere",
    hitCount: 10,
  },  {
    label: "Den Haag",
    hitCount: 9,
  },  {
    label: "Baarn",
    hitCount: 9,
  },  {
    label: "Soest",
    hitCount: 8,
  },  {
    label: "Alblasserdam",
    hitCount: 7,
  },  {
    label: "Groningen",
    hitCount: 6,
  },  {
    label: "Haarlem",
    hitCount: 5,
  },  {
    label: "Heerlen",
    hitCount: 5,
  },
];

export function getPopularItems(): ListItemType[] {
  return mockPupularItems;
}

const mockPupularItems: ListItemType[] = [
  {
    label: "EnergieTransitie",
    hitCount: 420,
  },  {
    label: "Omgevingswet",
    hitCount: 412,
  },  {
    label: "Klimaat",
    hitCount: 385,
  },  {
    label: "Privacy",
    hitCount: 370,
  },  {
    label: "Schulhulpverlening",
    hitCount: 355,
  },  {
    label: "Digitalisering",
    hitCount: 342,
  },  {
    label: "Energiebesparing",
    hitCount: 331,
  },  {
    label: "AVG",
    hitCount: 320,
  },  {
    label: "Informatieveiligheid",
    hitCount: 314,
  },  {
    label: "Sociaal domein",
    hitCount: 308,
  },
];
