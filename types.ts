export interface PopularTerm {
  label: string;
  hitCount: number;
}

// A single municipality + term combo from Elastic
export interface Aggregate {
  label: string;
  oriKey: string;
  hitCount: number;
}

export interface SearchResultsType {
  items: Aggregate[];
  count: number;
}

export interface PostionType {
  lat: number;
  lon: number;
}

export interface MunicipalityType {
  cbsCode: string;
  polygon: PostionType[];
}

export interface YearMonth {
  year: number;
  // From 1 to 12
  month: number;
}
