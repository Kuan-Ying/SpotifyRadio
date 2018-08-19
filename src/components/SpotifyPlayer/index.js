import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';

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

  previousTrack = () => {
    const { actions: { previousTrackRequest } } = this.props;
    previousTrackRequest();
  }

  nextTrack = () => {
    const { actions: { nextTrackRequest } } = this.props;
    nextTrackRequest();
  }

  render() {
    const {
      isLoading,
      trackInfo,
      tracks,
    } = this.props;

    return (
      <Segment.Group compact style={{ width: 400 }}>
        <Segment loading={isLoading} compact style={{ padding: 0 }}>
          <TrackPlayControl
            trackInfo={trackInfo}
            togglePlay={this.togglePlay}
            onPrevious={this.previousTrack}
            onNext={this.nextTrack}
          />
        </Segment>
        <Segment loading={isLoading} inverted compact>
          <TrackList tracks={tracks} />
        </Segment>
      </Segment.Group>
    );
  }
}

// TODO: get current track queue logic and remove
const trackTestData = [
  {
    duration: 267810,
    name: 'I really like you',
    isPlaying: true,
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
