import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import paths from "../paths";
import { Link } from "react-router-dom";
import React from "react";

import "../styles/Button.scss";

const BackButton = () =>
  <Link
    className="Button"
    to={paths.home}
  >
    <FontAwesomeIcon icon={faArrowLeft} />
    <span>Terug</span>
  </Link>;

export default BackButton;
