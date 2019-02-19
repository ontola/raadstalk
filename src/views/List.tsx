import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";

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
        </header>
        <SearchBar initialText={query}/>
        <p>Resultaten voor {query}</p>
      </React.Fragment>
    );
  }
}

export default withRouter(List);
