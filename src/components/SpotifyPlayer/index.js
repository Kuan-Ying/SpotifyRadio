import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Segment } from 'semantic-ui-react';

import {
  SpotifyActionCreators,
  isLoadingPlayerSelector,
} from '../../redux/modules/spotify';
import {
  currentTrackInfoSelector,
  playListSelector,
} from './selectors';
import TrackList from './TrackList';
import TrackPlayControl from './TrackPlayControl';

const PlayControlSegment = styled(Segment).attrs({
  loading: ({ isLoading }) => isLoading,
  compact: true,
})`
  padding: 0 !important;
`;

const TrackListSegment = styled(Segment).attrs({
  loading: ({ isLoading }) => isLoading,
  compact: true,
})`
  background: black !important;
`;

const SegmentWraper = styled(Segment.Group).attrs({
  compact: true,
})`
  margin: 0 !important;
`;

class SpotifyPlayer extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      initPlayerRequest: PropTypes.func.isRequired,
      togglePlayRequest: PropTypes.func.isRequired,
      previousTrackRequest: PropTypes.func.isRequired,
      nextTrackRequest: PropTypes.func.isRequired,
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
      <SegmentWraper>
        <PlayControlSegment isLoading={isLoading}>
          <TrackPlayControl
            trackInfo={trackInfo}
            togglePlay={this.togglePlay}
            onPrevious={this.previousTrack}
            onNext={this.nextTrack}
          />
        </PlayControlSegment>
        <TrackListSegment>
          <TrackList tracks={tracks} isLoading={isLoading} />
        </TrackListSegment>
      </SegmentWraper>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: isLoadingPlayerSelector(state),
  trackInfo: currentTrackInfoSelector(state),
  tracks: playListSelector(state),
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
