import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import paths from "../paths";
import { Link } from "react-router-dom";
import React from "react";

import "../styles/Button.scss";

const BackButton = () =>
  <Link
    className="Button"
    to={paths.home}
    title="Terug naar startscherm"
  >
    <FontAwesomeIcon icon={faArrowLeft} />
    <span>Terug</span>
  </Link>;

export default BackButton;
