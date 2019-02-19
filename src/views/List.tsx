import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

const defaultProps = {
  match: {
    params: {
      query: 'test'
    }
  }
};

/** Show the list of municipalities + hit counts for a single query */
class List extends Component<RouteComponentProps<any>> {
  public render() {
    return (
      <React.Fragment>
        <Link to="/">Home</Link>
        <p>Resultaten voor {this.props.match.params.query}</p>
      </React.Fragment>
    );
  }
}

export default withRouter(List);
