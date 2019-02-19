import React, { Component, ChangeEvent, FormEvent } from 'react';
import Radium from 'radium';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import { sharedColors, sharedBorderRadius } from '../sharedStyles';

import paths from '../paths';
import "../styles/SearchBar.scss";
import { withRouter, RouteComponentProps } from 'react-router';

const inputStyle = {
  borderRadius: sharedBorderRadius,
  borderStyle: 'solid',
  borderColor: sharedColors.g1,
  borderWidth: '1px',
  '::placeholder': {
    color: sharedColors.g1,
  },
  ':focus': {
    borderColor: sharedColors.blue,
    outline: 'none',
  },
  boxSizing: 'border-box' as 'border-box',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '10px',
  position: 'relative' as 'relative',
  width: '100%',
  height: '26px',
};

const wrapperStyle = {
  position: 'relative' as 'relative',
}

interface searchBarProps extends RouteComponentProps {
};

interface searchBarState {
  text: string,
};

class SearchBar extends Component<searchBarProps, searchBarState> {
  constructor(props: searchBarProps) {
    super(props);
    this.state = {
      text: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
  }

  handleChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({
      text: event.target.value
    });
  }

  handleOnSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.props.history.push(paths.list(this.state.text));
  }

  render() {
    return (
      <form
        style={wrapperStyle}
        onSubmit={this.handleOnSubmit}
      >
        <input
          placeholder="Zoeken..."
          style={inputStyle}
          type="text"
          onChange={this.handleChange}
        />
        <button className="SearchBar__search-icon" >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    );
  }
}

export default withRouter(Radium(SearchBar));
