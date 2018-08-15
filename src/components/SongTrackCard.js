import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Loader,
  Image,
  Icon,
  Segment,
  Card,
  Header,
} from 'semantic-ui-react';

import {
  SpotifyActionCreators,
  isLoadingPlayerSelector,
  currentTrackInfoSelector,
} from '../redux/modules/spotify';

class SongTrackCard extends Component {
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
    const { isLoading } = this.props;

    if (isLoading) {
      return <Loader active inline="centered" />;
    }

    const {
      trackInfo: {
        isPlaying,
        albumImg,
        artistsDisplayName,
        songName,
      },
    } = this.props;

    return (
      <Card centered>
        <Segment inverted textAlign="center">
          <Image src={albumImg} />
          <Header as="h3">{songName}</Header>
          <Header as="h4" inverted color="grey">{artistsDisplayName}</Header>
          <Icon
            name={isPlaying ? 'pause circle outline' : 'play circle outline'}
            size="big"
            onClick={this.togglePlay}
          />
        </Segment>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: isLoadingPlayerSelector(state),
  trackInfo: currentTrackInfoSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    ...SpotifyActionCreators,
  }, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SongTrackCard);
