import React, { Component, ChangeEvent, FormEvent } from "react";
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
  paddingTop: "4px",
  paddingBottom: "4px",
  paddingLeft: "10px",
  position: "relative" as "relative",
  width: "100%",
  height: "26px",
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
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {
      text: this.props.initialText || "",
    };

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
    this.props.history.push(paths.home);
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
          value={this.state.text}
        />
        {this.state.text &&
          <button
            className="SearchBar__reset-icon"
            onClick={this.handleReset}
            type="button"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        }
        <button
          type="button"
          className="SearchBar__search-icon"
          onClick={this.handleOnSubmit}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    );
  }
}

export default withRouter(Radium(SearchBar));
