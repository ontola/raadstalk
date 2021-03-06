const paths = {
  home: "/widget/",
  /** Search for a string and see the municipalities with counts in a list*/
  list: (query: string) => `/widget/list/${query}`,
  /** Search for a string and see the municipalities with counts in a map*/
  map: (query: string) => `/widget/map/${query}`,
  /** Open OpenRaadsInformatie and search for a specific term */
  ORISearch: (query: string = "", gemeente: string) => {
    const url = new URL("http://zoek.openraadsinformatie.nl/");
    url.searchParams.append("zoekterm", `"${query}"`);

    const transformedString = gemeente.toLowerCase().split(" ").join("_");
    url.searchParams.append("organisaties", `["ori_${transformedString}*"]`);
    // TODO: make this flexible
    // url.searchParams.append("datums", "[\"2019-04-01\",\"2019-05-30\"]");

    return url.href;
  },
  contactMail: "mailto:info@vngrealisatie.nl?SUBJECT=RaadsTalk",
  // TODO: make repo public.
  github: "https://github.com",
  about: "/widget/about",
  wayWard: "https://github.com/aolieman/wayward",
  openRaadsInformatie: "https://openraadsinformatie.nl",
};

export default paths;
