import React from "react";

import ListSearch from "../components/ListSearch";
import vngLogo from "../images/VNGRealisatieLogo.svg";

const Home: React.FunctionComponent = () => (
  <div>
    <header>
      <img
        src={vngLogo}
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
