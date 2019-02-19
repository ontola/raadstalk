import React, { Component } from "react";

import ListItem from "./ListItem";
import SearchBar from "./SearchBar";

interface ListSearchProps {
  items: Array<[string, number]>;
}

export default class ListSearch extends Component<ListSearchProps> {
  public renderListItems() {
    if (this.props.items !== undefined) {
      const minWidth = 10.0;
      const maxWidth = 80.0;

      const values = this.props.items.map(([, hits]) => hits);
      const minHit = Math.min(...values);
      const maxHit = Math.max(...values);
      const alpha = (maxWidth - minWidth) / (maxHit - minHit);

      const result = this.props.items.map(([term, termHit]) => {
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
    return null;
  }

  public render() {
    return (
      <div className="ListSearch">
        {this.renderListItems()}
      </div>
    );
  }
}
