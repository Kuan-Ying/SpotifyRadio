import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Modal,
  Button,
  Input,
  Icon,
  Header,
  Segment,
} from 'semantic-ui-react';

import {
  SpotifyActionCreators,
  isSearchingSelector,
} from '../../redux/modules/spotify';
import {
  extractedSearchedTracksSelectors,
} from './selectors';
import SongTable from '../SongTable';

class SearchModal extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      searchTracksRequest: PropTypes.func.isRequired,
    }).isRequired,
    isSearching: PropTypes.bool.isRequired,
    searchedTracks: PropTypes.array.isRequired,
  }
  state = {
    query: '',
    isModalVisible: false,
  };

  search = () => {
    const { query } = this.state;
    const { actions: { searchTracksRequest } } = this.props;
    searchTracksRequest(query);
    this.setState({ isModalVisible: true });
  }

  searchButton = (
    <Button icon onClick={this.search}>
      <Icon name="search" />
    </Button>
  );

  handleEnter = ({ key }) => {
    if (key === 'Enter') {
      this.search();
    }
  };

  render() {
    const {
      query,
      isModalVisible,
    } = this.state;
    const {
      searchedTracks,
      isSearching,
    } = this.props;
    return (
      <div>
        <Input icon placeholder="Search...">
          <input
            onChange={({ target: { value } }) => this.setState({ query: value })}
            onKeyPress={this.handleEnter}
          />
        </Input>
        <Modal
          open={isModalVisible}
          closeOnDimmerClick
          onClose={() => this.setState({ isModalVisible: false })}
          trigger={this.searchButton}
          centered={false}
        >
          <Segment inverted>
            <Modal.Header>
              <Header as="h1" inverted>
                Showing Songs for {query}
              </Header>
              <br />
            </Modal.Header>
            <Modal.Content scrolling>
              <SongTable
                isLoading={isSearching}
                tracks={searchedTracks}
                onCallback={() => this.setState({ isModalVisible: false })}
              />
            </Modal.Content>
          </Segment>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchedTracks: extractedSearchedTracksSelectors(state),
  isSearching: isSearchingSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...SpotifyActionCreators,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchModal);
