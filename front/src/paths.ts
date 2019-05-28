const paths = {
  home: "/widget/",
  /** Search for a string and see the municipalities with counts in a list*/
  list: (query: string) => `/widget/list/${query}`,
  /** Search for a string and see the municipalities with counts in a map*/
  map: (query: string) => `/widget/map/${query}`,
  /** Open OpenRaadsInformatie and search for a specific term */
  ORISearch: (query: string = "", gemeente: string) => {
    const url = new URL("http://ori.argu.co/");
    url.searchParams.append("zoekterm", `"${query}"`);

    const transformedString = gemeente.toLowerCase().split(" ").join("_");
    url.searchParams.append("gemeenten", `["ori_${transformedString}*"]`);

    return url.href;
  },
  contactMail: "mailto:info@vngrealisatie.nl?SUBJECT=RaadsTalk",
  // TODO: make repo public.
  github: "https://github.com",
  about: "/widget/about",
  openRaadsInformatie: "https://openraadsinformatie.nl",
};

export default paths;
