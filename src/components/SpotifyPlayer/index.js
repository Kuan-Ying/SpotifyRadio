import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Loader,
  Segment,
  Card,
} from 'semantic-ui-react';

import {
  SpotifyActionCreators,
  isLoadingPlayerSelector,
  currentTrackInfoSelector,
} from '../../redux/modules/spotify';

import TrackList from './TrackList';
import TrackPlayControl from './TrackPlayControl';

class SpotifyPlayer extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      initPlayerRequest: PropTypes.func.isRequired,
      togglePlayRequest: PropTypes.func.isRequired,
    }).isRequired,
    trackInfo: PropTypes.shape({
      isPlaying: PropTypes.bool,
      albumImg: PropTypes.string,
      artistsDisplayName: PropTypes.string,
      songName: PropTypes.string,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
    tracks: PropTypes.array.isRequired,
  }

  componentDidMount() {
    const { actions: { initPlayerRequest } } = this.props;
    initPlayerRequest();
  }

  togglePlay = () => {
    const { actions: { togglePlayRequest } } = this.props;
    togglePlayRequest();
  }

  render() {
    const {
      isLoading,
      trackInfo,
      tracks,
    } = this.props;

    if (isLoading) {
      return <Loader active inline="centered" />;
    }

    return (
      <Card>
        <Segment.Group>
          <TrackPlayControl
            trackInfo={trackInfo}
            togglePlay={this.togglePlay}
          />
          <TrackList tracks={tracks} />
        </Segment.Group>
      </Card>
    );
  }
}

// TODO: get current track queue logic and remove test data
const trackTestData = [
  {
    duration: 267810,
    name: 'I really like you',
    isPlaying: true,
  },
  {
    duration: 237810,
    name: 'attention',
    isPlaying: false,
  },
  {
    duration: 237810,
    name: 'attention',
    isPlaying: false,
  },
  {
    duration: 237810,
    name: 'attention',
    isPlaying: false,
  },
  {
    duration: 237810,
    name: 'attention',
    isPlaying: false,
  },
  {
    duration: 237810,
    name: 'attention',
    isPlaying: false,
  },
];

const mapStateToProps = state => ({
  isLoading: isLoadingPlayerSelector(state),
  trackInfo: currentTrackInfoSelector(state),
  tracks: trackTestData,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...SpotifyActionCreators,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpotifyPlayer);
