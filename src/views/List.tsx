import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import ListSearch from "../components/ListSearch";
import { getSearchResults } from "../API";
import { ListItemType } from "../types";
import Spinner from "../components/Spinner";

/** Show the list of municipalities + hit counts for a single query */
const List: React.SFC<RouteComponentProps<any>> = (props) => {

  const [items, setItems] = useState<ListItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const query = props.match.params.query;

  useEffect(
    () => {
      setLoading(true);
      getSearchResults(query).then((result) => {
        setLoading(false);
        return setItems(result);
      });
    },
    [query],
  );

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
      {loading && <Spinner/>}
      {!loading && <ListSearch isMunicipality items={items} searchTerm={query}/>}
    </React.Fragment>
  );
};

export default withRouter(List);
