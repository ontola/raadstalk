import React from "react";

import ListSearch from "../components/ListSearch";
import VNGRealisatieLogoSvg from "../images/VNGRealisatieLogo.svg";
import SearchBar from "../components/SearchBar";
import { ListItemType } from "../types";
import { getPopularItems } from "../API";

const Home: React.FunctionComponent = () => {
  const listItems = getPopularItems();
  return (
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
      <p>Meest voorkomende termen:</p>
      <ListSearch items={listItems} />
    </div>
  );
};

export default Home;
