import React, { Component } from "react";

export interface PropTypes {
  term: string;
  termHit: number;
  widthPercent: number;
}

export default class ListItem extends Component<PropTypes> {
  public render() {
    return (
      <li className="ListItem">
        <span>{this.props.term}</span>
        <span className="ListItem-hits">{this.props.termHit}</span>
        <div className="ListItem-bar" style={{ width: `${this.props.widthPercent}%` }}>&nbsp;</div>
      </li>
    );
  }
}
