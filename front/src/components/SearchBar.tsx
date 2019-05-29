import React, { Component, ChangeEvent } from "react";
import Radium from "radium";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import { sharedColors, sharedBorderRadius } from "../sharedStyles";

import paths from "../paths";
import "../styles/SearchBar.scss";
import { withRouter, RouteComponentProps } from "react-router";

const inputStyle = {
  borderRadius: sharedBorderRadius,
  borderStyle: "solid",
  borderColor: sharedColors.g1,
  borderWidth: "1px",
  "::placeholder": {
    color: sharedColors.g1,
  },
  ":focus": {
    borderColor: sharedColors.blue,
    outline: "none",
  },
  boxSizing: "border-box" as "border-box",
  paddingTop: ".3rem",
  paddingBottom: ".3rem",
  paddingLeft: ".7rem",
  position: "relative" as "relative",
  width: "100%",
  fontSize: ".9rem",
  height: "2.2rem",
};

const wrapperStyle = {
  position: "relative" as "relative",
};

interface SearchBarProps extends RouteComponentProps {
  initialText?: string;
}

interface SearchBarState {
  text: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  private searchBarRef: React.RefObject<HTMLInputElement>;

  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      text: this.props.initialText || "",
    };

    this.searchBarRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      text: event.target.value,
    });
  }

  handleOnSubmit(event: any) {
    event.preventDefault();
    const text = this.state.text;

    if (text.length > 0) {
      if (this.props.match.path === paths.map(":query")) {
        this.props.history.push(paths.map(text));
      } else {
        this.props.history.push(paths.list(text));
      }
    } else {
      this.props.history.push(paths.home);
    }
  }

  handleReset(event: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      text: "",
    });
    if (this.searchBarRef.current) {
      this.searchBarRef.current.focus();
    }
  }

  render() {
    return (
      <form
        className="SearchBar"
        style={wrapperStyle}
        onSubmit={this.handleOnSubmit}
      >
        <input
          autoFocus
          placeholder="Zoeken op term..."
          style={inputStyle}
          type="text"
          onChange={this.handleChange}
          ref={this.searchBarRef}
          value={this.state.text}
        />
        {this.state.text &&
          <button
            className="SearchBar__reset-icon"
            onClick={this.handleReset}
            type="button"
            title="Zoekbalk leeg maken"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        }
        <button
          type="button"
          className="SearchBar__search-icon"
          onClick={this.handleOnSubmit}
          title="Zoeken"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    );
  }
}

export default withRouter(Radium(SearchBar));
