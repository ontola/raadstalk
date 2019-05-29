import React from "react";

import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import PopularContainer from "../containers/PopularContainer";

const Home: React.FunctionComponent = () => {
  return (
    <React.Fragment>
      <Header>
        <span className="Header__slogan">Wat bespreekt de gemeenteraad?</span>
      </Header>
      <SearchBar/>
      <p>Met RaadsTalk zoekt u in raadsdocumenten van meer dan 110 gemeenten in Nederland.</p>
      <b>Meest besproken onderwerpen:</b>
      <PopularContainer />
    </React.Fragment>
  );
};

export default Home;
