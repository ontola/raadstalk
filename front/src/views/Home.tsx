import React from "react";

import ListSearch from "../components/ListSearch";
import VNGRealisatieLogoSvg from "../images/VNGRealisatieLogo.svg";
import SearchBar from "../components/SearchBar";
import PopularContainer from "../containers/PopularContainer";

const Home: React.FunctionComponent = () => {
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
      <PopularContainer />
    </div>
  );
};

export default Home;
