import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import MapComponent from "../components/MapComponent";
import Header from "../components/Header";

/** Show the list of municipalities + hit counts for a single query */
class List extends Component<RouteComponentProps<any>> {
  public render() {
    const query = this.props.match.params.query;
    return (
      <React.Fragment>
        <Header>
          <BackButton/>
          <Link
            to={paths.list(query)}
            className="Button"
          >
            <FontAwesomeIcon icon={faListUl} />
            <span>
              Lijst
            </span>
          </Link>
        </Header>
      <SearchBar initialText={query}/>
      <MapComponent/>
      </React.Fragment>
    );
  }
}

export default withRouter(List);
