import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import SearchBar from "../components/SearchBar";
import paths from "../paths";
import ListSearch from "../components/ListSearch";
import { getSearchResults, getPopularItems } from "../API";
import { ListItemType } from "../../../types";
import Spinner from "../components/Spinner";

/** Show the list of municipalities + hit counts for a single query */
const List: React.SFC<any> = (props) => {

  const [items, setItems] = useState<ListItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(
    () => {
      setLoading(true);
      getPopularItems().then((result) => {
        setLoading(false);
        return setItems(result);
      });
    },
    [],
  );

  return (
    <React.Fragment>
      {loading && <Spinner />}
      {!loading && <ListSearch items={items} />}
    </React.Fragment>
  );
};

export default List;
