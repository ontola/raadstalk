import React, { Component } from "react";
import paths from "../paths";
import { Link } from "react-router-dom";

export interface PropTypes {
  /** Text label*/
  term: string;
  /** Amount of hits*/
  termHit: number;
  /** How wide the bar is*/
  widthPercent: number;
}

export default class ListItem extends Component<PropTypes> {
  public render() {
    return (
      <Link to={paths.list(this.props.term)} className="ListItem">
        <span>{this.props.term}</span>
        <span className="ListItem-hits">{this.props.termHit}</span>
        <div className="ListItem-bar" style={{ width: `${this.props.widthPercent}%` }}>&nbsp;</div>
      </Link>
    );
  }
}
