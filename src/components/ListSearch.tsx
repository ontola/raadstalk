import React, { Component } from "react";

import ListItem from "./ListItem";
import { ListItemType } from "../types";

interface ListSearchProps {
  items: ListItemType[];
  isMunicipality: boolean;
  searchTerm?: string;
}

export default class ListSearch extends Component<ListSearchProps> {
  public renderListItems() {
    if (this.props.items !== null) {
      const minWidth = 10.0;
      const maxWidth = 80.0;

      const values = this.props.items.map(({ hitCount }) => hitCount);
      const minHit = Math.min(...values);
      const maxHit = Math.max(...values);
      const alpha = (maxWidth - minWidth) / (maxHit - minHit);

      const result = this.props.items.map(({label, hitCount}) => {
        const percentage = alpha * (hitCount - minHit) + minWidth;

        return (
          <ListItem
            key={label}
            label={label}
            hitCount={hitCount}
            widthPercent={percentage}
            isMunicipality={this.props.isMunicipality}
            searchTerm={this.props.searchTerm}
          />
        );
      });

      return <ul>{result}</ul>;
    }
    return null;
  }

  static defaultProps = {
    isMunicipality: false,
  };

  public render() {
    if (this.props.items.length === 0) {
      return (<p>Er zijn geen resultaten gevonden.</p>);
    }
    return (
      <div className="ListSearch">
        {this.renderListItems()}
      </div>
    );
  }
}
