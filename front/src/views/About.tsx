import React, { Component } from "react";

import BackButton from "../components/BackButton";
import paths from "../paths";
import Header from "../components/Header";

export default class About extends Component {
  render() {
    return (
      <div id="about">
        <Header>
          <BackButton/>
        </Header>
        <h2>Over RaadsTalk</h2>
        <p>De Webapp Trends Open Raadsinformatie applicatie is een hulpmiddel ontwikkeld door {" "}
          <a href="https://www.vngrealisatie.nl/">VNG Realisatie</a>.</p>
        <p>De data die je ziet zijn afkomstig uit <a href={paths.openRaadsInformatie}>
        Open Raadsinformatie</a>. Onderhand delen al meer dan 100 gemeenten hun raadsinformatie
        (vergaderingen, agendapunten, documenten) via dit systeem.</p>
        <p>De analyse van de woorden worden gedaan met de <a href={paths.wayWard}>WayWard library.
        </a></p>
        <p>Wil je deze app ook op jouw website hebben,
          of wil je dat jouw gemeentedata hierbij komt? Neem dan
          {/* Staat jouw gemeente hier nog niet tussen? Neem dan met ons {" "} */}
          <a href={paths.contactMail}>contact</a> op.</p>
        {/* <p>Bekijk dan de documentatie op {" "}</p> */}
        {/* <a href={paths.github}>Github</a>. Je kunt hier ook de broncode bekijken.*/}
      </div>
    );
  }
}
