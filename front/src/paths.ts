const paths = {
  home: "/widget/",
  /** Search for a string and see the municipalities with counts in a list*/
  list: (query: string) => `/widget/list/${query}`,
  /** Search for a string and see the municipalities with counts in a map*/
  map: (query: string) => `/widget/map/${query}`,
  /** Open OpenRaadsInformatie and search for a specific term */
  ORISearch: (query: string = "") => `http://zoek.openraadsinformatie.nl/#/search/${query}/`,
  contactMail: "mailto:info@vngrealisatie.nl?SUBJECT=RaadsTalk",
  // TODO: make repo public.
  github: "https://github.com",
  openRaadsInformatie: "https://openraadsinformatie.nl",
};

export default paths;
