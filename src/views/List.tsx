import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import ListSearch from "../components/ListSearch";
import { getSearchResults } from "../API";

/** Show the list of municipalities + hit counts for a single query */
class List extends Component<RouteComponentProps<any>> {
  public render() {
    const query = this.props.match.params.query;

    const listItems = getSearchResults(query);
    return (
      <React.Fragment>
        <header>
          <BackButton/>
          <Link
            to={paths.map(query)}
            className="Button Button--float-right"
          >
            <FontAwesomeIcon icon={faMap} />
            <span>
              Kaart
            </span>
          </Link>
        </header>
        <SearchBar initialText={query}/>
        <p>Aantal keer besproken in gemeenten:</p>
        <ListSearch items={listItems}/>
      </React.Fragment>
    );
  }
}

export default withRouter(List);
