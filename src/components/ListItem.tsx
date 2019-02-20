import React, { Component } from "react";
import paths from "../paths";
import { Link } from "react-router-dom";

import "../styles/ListItem.scss";

export interface PropTypes {
  /** Text label*/
  label: string;
  /** Amount of hits*/
  hitCount: number;
  /** How wide the bar is*/
  widthPercent: number;
}

export default class ListItem extends Component<PropTypes> {
  public render() {
    return (
      <Link to={paths.list(this.props.label)} className="ListItem">
        <span>{this.props.label}</span>
        <span className="ListItem-hits">{this.props.hitCount}</span>
        <div className="ListItem-bar" style={{ width: `${this.props.widthPercent}%` }}>&nbsp;</div>
      </Link>
    );
  }
}
