import React, { useState, useEffect } from "react";
import { getPopularItems } from "../API";
import { PopularTerm, YearMonth } from "../../../types";
import Spinner from "../components/Spinner";
import ListSearch from "../components/ListSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { getPreviousMonth, addMonth, subtractMonth, startDate } from "../helpers/dates";
import { bugsnagClient } from "../index";

/** Show the list of municipalities + hit counts for a single query */
const PopularContainer: React.SFC<any> = (props) => {

  const [items, setItems] = useState<PopularTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<YearMonth>(getPreviousMonth());
  const [error, setError] = useState<Error | null>(null);

  useEffect(
    () => {
      setLoading(true);
      getPopularItems(date)
      .then((result) => {
        setLoading(false);
        return setItems(result);
      })
      .catch((e) => {
        setError(e);
        bugsnagClient.notify(e);
      });
    },
    [date],
  );

  const upDate = () => {
    setDate(addMonth(date));
  };

  const downDate = () => {
    setDate(subtractMonth(date));
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <React.Fragment>
      <div>
        <button
          className="Button__date"
          onClick={downDate}
          disabled={JSON.stringify(date) === JSON.stringify(startDate)}
          title="Vorige maand"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>{date.year}-{date.month}</span>
        <button
          className="Button__date"
          onClick={upDate}
          disabled={JSON.stringify(date) === JSON.stringify(getPreviousMonth())}
          title="Volgende maand"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      {loading && <Spinner />}
      {!loading && <ListSearch items={items} />}
    </React.Fragment>
  );
};

export default PopularContainer;
