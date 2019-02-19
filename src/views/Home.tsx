import React, { Component } from "react";

import ListSearch from "../components/ListSearch";
import VNGRealisatieLogoSvg from "../images/VNGRealisatieLogo.svg";

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
    <ListSearch />
  </div>
);

export default Home;
