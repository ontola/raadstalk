import React, { Component } from "react";

import ListItem from "./ListItem";
import { ListItemType } from "../types";

interface ListSearchProps {
  items: ListItemType[] | null;
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
