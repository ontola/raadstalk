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
  /** Whether the item is a municipality */
  isMunicipality: boolean;
  /** The term to open in Open Raadsinformatie */
  searchTerm?: string;
}

interface LinkCompPropTypes {
  children: any;
  isMunicipality: boolean;
  searchTerm?: string;
  label: string;
}

const LinkComp = (props: LinkCompPropTypes) => {
  if (props.isMunicipality) {
    return (
      <a
        href={paths.ORISearch(props.searchTerm)}
        className="ListItem"
        target="_blank"
        title="Bekijk in Open Raadsinformatie"
      >
        {props.children}
      </a>
    );
  }
  return (
    <Link to={paths.list(props.label)} className="ListItem">
      {props.children}
    </Link>
  );
};

export default class ListItem extends Component<PropTypes> {
  public render() {
    return (
      <LinkComp
        isMunicipality={this.props.isMunicipality}
        searchTerm={this.props.searchTerm}
        label={this.props.label}
      >
        <span>{this.props.label}</span>
        <span className="ListItem-hits">{this.props.hitCount}</span>
        <div className="ListItem-bar" style={{ width: `${this.props.widthPercent}%` }}>&nbsp;</div>
      </LinkComp>
    );
  }
}
