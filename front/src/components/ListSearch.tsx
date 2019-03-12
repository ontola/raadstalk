import React, { Component } from "react";

import ListItem from "./ListItem";
import { ListItemType } from "../../../types";

interface ListSearchProps {
  items: ListItemType[];
  isMunicipality: boolean;
  searchTerm?: string;
  count?: number;
}

export default class ListSearch extends Component<ListSearchProps> {
  public renderListItems() {
    if (this.props.items !== null) {

      const values = this.props.items.map(({ hitCount }) => hitCount);
      const maxHit = Math.max(...values);

      const result = this.props.items.map(({ label, hitCount }) => {
        const percentage = 90 * (hitCount / maxHit);

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
        {this.props.count && <p><b>{this.props.count}</b> keer besproken in gemeenteraden.</p>}
        {this.renderListItems()}
      </div>
    );
  }
}
