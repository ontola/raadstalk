const paths = {
  home: "/",
  /** Search for a string and see the municipalities with counts in a list*/
  list: (query: string) => `/list/${query}`,
  /** Search for a string and see the municipalities with counts in a map*/
  map: (query: string) => `/map/${query}`,
  contactMail: "info@vngrealisatie.nl",
  // TODO: make repo public.
  github: "https://github.com",
  openRaadsInformatie: "https://openraadsinformatie.nl",
};

export default paths;
