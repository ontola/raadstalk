import React, { Component } from "react";

import ListItem from "./ListItem";
import { PopularTerm } from "../../../types";

export interface SearchResultProps {
  items: PopularTerm[];
  searchTerm?: string;
  count?: number;
}

interface ListSearchProps extends SearchResultProps {
  isMunicipality: boolean;
}

export default class ListSearch extends Component<ListSearchProps> {
  public renderListItems() {
    if (this.props.items !== null) {

      const values = this.props.items.map(({ hitCount }) => hitCount);
      const maxHit = Math.max(...values);

      const compare = (a: PopularTerm, b: PopularTerm) => {
        return b.hitCount - a.hitCount;
      };

      const result = this.props.items.sort(compare).map(({ label, hitCount }) => {
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
      return (<p>'{this.props.searchTerm}' is niet gevonden.</p>);
    }
    return (
      <div className="ListSearch">
        {this.props.count &&
          <p><b>{this.props.count}</b> keer besproken in gemeenteraden.</p>
        }
        {(this.props.items.length > 0) && this.renderListItems()}
      </div>
    );
  }
}
