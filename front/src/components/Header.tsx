import React from "react";

import "../styles/Header.scss";
import { Link } from "react-router-dom";
import paths from "../paths";

interface PropTypes {
  children?: React.ReactNode;
}

const Header = ({ children }: PropTypes) =>
  <header className="Header">
    <Link
      to={paths.home}
      className="Logo"
      title="Terug naar startscherm"
    >
      <span className="Logo--first-word">Raads</span>
      <span className="Logo--second-word">Talk</span>
    </Link>
    <div className="Header--children">
      {children}
    </div>
  </header>
;

export default Header;
