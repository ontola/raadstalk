import { ListItemType } from "./types";

export function getSearchResults(query: string): ListItemType[] | null {
  const data = {
    query: {
      match: {
        description: query,
      },
    },
    from: 0,
    size: 10,
  };

  fetch("/search", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    body: JSON.stringify(data),
  })
  .then((response) => {
    response.json().then((json) => {
      const body = json;
      console.log(body);
      return(body);
    }).catch(reason => new Error(reason));
  }).catch((reason) => {
    return(mockMunicipalitiesHits);
  });
  return(mockMunicipalitiesHits);
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
