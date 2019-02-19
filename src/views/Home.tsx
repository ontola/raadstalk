import React from "react";

import ListSearch from "../components/ListSearch";
import VNGRealisatieLogoSvg from "../images/VNGRealisatieLogo.svg";
import SearchBar from "../components/SearchBar";

const Home: React.FunctionComponent = () => (
  <div>
    <header>
      <img
        src={VNGRealisatieLogoSvg}
        alt="VNG"
        style={{
          width: "50px",
        }}
      />
      <span>RaadsTalk</span>
    </header>
    <SearchBar/>
    <ListSearch items={listItems} />
  </div>
);

const listItems: [string, number][] = [
  ["Energietransitie", 420],
  ["Omgevingswet", 415],
  ["Klimaat", 395],
  ["Privacy", 370],
  ["Schuldhulpverlening", 355],
  ["Digitalisering", 342],
  ["Energiebesparing", 331],
  ["Algemene vordering persoonsgegevens", 320],
  ["Informatieveiligheid", 314],
  ["Transformatie sociaal domein", 308],
];

export default Home;
