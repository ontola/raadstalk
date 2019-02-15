import React from "react";

import ListSearch from "../components/ListSearch";
import vngLogo from "../images/vng-logo.png";

const Home: React.FunctionComponent = () => (
  <div>
    <header>
      <img src={vngLogo} alt="VNG" />
      <span>RaadsTalk</span>
    </header>
    <ListSearch />
  </div>
);

export default Home;
