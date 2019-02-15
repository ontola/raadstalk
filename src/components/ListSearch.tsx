import React, { Component } from "react";

import ListItem from "./ListItem";
import SearchBar from "./SearchBar";

const listItems: Array<[string, number]> = [
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

export default class ListSearch extends Component {
  public renderListItems() {
    const minWidth = 10.0;
    const maxWidth = 80.0;

    const values = listItems.map(([, hits]) => hits);
    const minHit = Math.min(...values);
    const maxHit = Math.max(...values);
    const alpha = (maxWidth - minWidth) / (maxHit - minHit);

    const result = listItems.map(([term, termHit]) => {
      const percentage = alpha * (termHit - minHit) + minWidth;

      return (
        <ListItem
          key={term}
          term={term}
          termHit={termHit}
          widthPercent={percentage}
        />
      );
    });

    return <ul>{result}</ul>;
  }

  public render() {
    return (
      <div className="ListSearch">
        <SearchBar/>
        {this.renderListItems()}
      </div>
    );
  }
}
