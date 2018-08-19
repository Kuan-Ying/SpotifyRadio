import React, { Component } from 'react';
import PropTyeps from 'prop-types';
import {
  Button,
  Icon,
  Input,
} from 'semantic-ui-react';

class SearchBar extends Component {
  static propTypes = {
    search: PropTyeps.func.isRequired,
  };
  state = {
    query: '',
  };

  render() {
    const { search } = this.props;
    const { query } = this.state;
    return (
      <Input icon placeholder="Search...">
        <input onChange={({ target: { value } }) => this.setState({ query: value })} />
        <Button icon onClick={() => search(query)}>
          <Icon name="search" />
        </Button>
      </Input>
    );
  }
}

export default SearchBar;
