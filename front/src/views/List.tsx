import React, { useState, useEffect } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import ListSearch from "../components/ListSearch";
import { getSearchResults } from "../API";
import { PopularTerm } from "../../../types";
import Spinner from "../components/Spinner";

/** Show the list of municipalities + hit counts for a single query */
const List: React.SFC<RouteComponentProps<any>> = (props) => {

  const [items, setItems] = useState<PopularTerm[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const query = props.match.params.query;

  useEffect(
    () => {
      setLoading(true);
      getSearchResults(query)
      .then((result) => {
        setLoading(false);
        setItems(result.items);
        setCount(result.count);
      });
    },
    [query],
  );

  return (
    <React.Fragment>
      <BackButton />
      <SearchBar initialText={query} />
      {loading && <Spinner />}
      {!loading && <ListSearch isMunicipality count={count} items={items} searchTerm={query} />}
    </React.Fragment>
  );
};

export default withRouter(List);
