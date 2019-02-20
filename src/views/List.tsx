import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import ListSearch from "../components/ListSearch";

const defaultProps = {
  match: {
    params: {
      query: "test",
    },
  },
};

/** Show the list of municipalities + hit counts for a single query */
class List extends Component<RouteComponentProps<any>> {
  public render() {
    const query = this.props.match.params.query;
    return (
      <React.Fragment>
        <header>
          <BackButton/>
          <Link
            to={paths.map(query)}
            className="Button Button--float-right"
          >
            <span>
              Kaart
            </span>
            <FontAwesomeIcon icon={faMap} />
          </Link>
        </header>
        <SearchBar initialText={query}/>
        <p>Aantal keer besproken in gemeenten:</p>
        <ListSearch items={listItems}/>
      </React.Fragment>
    );
  }
}

const listItems: [string, number][] = [
  ["Amsterdam", 23],
  ["Utrecht", 20],
  ["Almere", 18],
  ["Den Haag", 10],
  ["Baarn", 9],
  ["Soest", 9],
  ["Alblasserdam", 8],
  ["Groningen", 7],
  ["Haarlem", 6],
  ["Heerlen", 5],
];

export default withRouter(List);
