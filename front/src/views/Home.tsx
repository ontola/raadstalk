import React from "react";

import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import PopularContainer from "../containers/PopularContainer";

const Home: React.FunctionComponent = () => {
  return (
    <div className="Wrapper">
      <Header>
        <span className="Header__slogan">Wat bespreekt de gemeenteraad?</span>
      </Header>
      <SearchBar/>
      <p>Met RaadsTalk zoekt u in raadsdocumenten van meer dan 110 gemeenten in Nederland.</p>
      <b>Meest besproken onderwerpen:</b>
      <PopularContainer />
    </div>
  );
};

export default Home;
