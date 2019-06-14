import React, { Component } from "react";
import paths from "../paths";
import { Link } from "react-router-dom";

import "../styles/ListItem.scss";
import { faFileAlt, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  hitCount?: number;
}

const LinkComp = (props: LinkCompPropTypes) => {
  if (props.isMunicipality) {
    return (
      <a
        href={paths.ORISearch(props.searchTerm, props.label)}
        className="ListItem"
        target="_blank"
        title="Bekijk documenten in Open Raadsinformatie"
      >
        <span>{props.label}</span>
        <FontAwesomeIcon className={"ListItem__external"} icon={faExternalLinkAlt} />
        {props.children}
      </a>
    );
  }
  return (
    <Link
      to={paths.list(props.label)}
      className="ListItem"
      title={`Bekijk in welke gemeenten '${props.label}' werd besproken`}
    >
      <span>{props.label}</span>
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
        hitCount={this.props.hitCount}
      >
        <span className="ListItem-hits">
          {this.props.hitCount}
          <FontAwesomeIcon icon={faFileAlt} />
        </span>
        {(this.props.widthPercent < 100 && this.props.widthPercent > 0) &&
          <div
            className="ListItem-bar"
            style={{ width: `${this.props.widthPercent}%` }}>
            &nbsp;
          </div>
        }
      </LinkComp>
    );
  }
}
