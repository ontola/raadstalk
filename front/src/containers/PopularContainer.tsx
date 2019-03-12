import React, { useState, useEffect } from "react";
import { getPopularItems } from "../API";
import { PopularTerm } from "../../../types";
import Spinner from "../components/Spinner";
import ListSearch from "../components/ListSearch";

/** Show the list of municipalities + hit counts for a single query */
const List: React.SFC<any> = (props) => {

  const [items, setItems] = useState<PopularTerm[]>([]);
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
