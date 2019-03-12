import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import { getSearchResults } from "../API";
import { Aggregate } from "../../../types";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import MapComponent from "../components/MapComponent";

/** Show the list of municipalities + hit counts for a single query */
const List: React.SFC<RouteComponentProps<any>> = (props) => {

  const [items, setItems] = useState<Aggregate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const query = props.match.params.query;

  useEffect(
    () => {
      setLoading(true);
      getSearchResults(query).then((result) => {
        setLoading(false);
        setItems(result.items);
      });
    },
    [query],
  );

  return (
    <React.Fragment>
      <Header>
        <BackButton/>
        <Link
          to={paths.list(query)}
          className="Button"
          title="Bekijk zoekresultaten in lijstweergave"
        >
          <FontAwesomeIcon icon={faListUl} />
          <span>
            Lijst
          </span>
        </Link>
      </Header>
      <SearchBar initialText={query} />
      {loading && <Spinner />}
      {!loading && <MapComponent items={items} searchTerm={query} />}
    </React.Fragment>
  );
};

export default withRouter(List);
