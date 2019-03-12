export interface ListItemType {
  label: string;
  hitCount: number;
}

export interface SearchResultsType {
  items: ListItemType[];
  count: number;
}
