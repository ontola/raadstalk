import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { withRouter, RouteComponentProps } from "react-router-dom";
import React from "react";

import "../styles/Button.scss";

const BackButton = (props: RouteComponentProps) =>
  <button
    className="Button"
    onClick={props.history.goBack}
    title="Vorige pagina"
  >
    <FontAwesomeIcon icon={faArrowLeft} />
    <span>Terug</span>
  </button>;

export default withRouter(BackButton);
