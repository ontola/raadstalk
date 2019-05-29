import React from "react";

import SearchBar from "../components/SearchBar";
import PopularContainer from "../containers/PopularContainer";

const Home: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <SearchBar/>
      <p>
        <b>Meest besproken onderwerpen:</b>
      </p>
      <PopularContainer />
    </React.Fragment>
  );
};

export default Home;
