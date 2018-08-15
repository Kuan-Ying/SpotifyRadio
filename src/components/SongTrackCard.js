import React, { Component } from 'react';
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

import { SpotifyActionCreators } from '../redux/modules/spotify';

import SpotifyService from '../services/SpotifyService';

class SongTrackCard extends Component {
  state = {
    isPlaying: false,

    // NOTE: should fetch spotifyUri from firebase
    spotifyUri: 'spotify:track:6i87BCsPUiPLtBqTEK6Y4A',
    positionMs: 0,
    albumImg: '',
    artistsDisplay: '',
  };

  componentDidMount() {
    const { actions } = this.props;
    actions.initPlayerRequest({ playerStateChangedCb: this.getCurrentTrackInfo });
  }

  getCurrentTrackInfo = async () => {
    const result = await SpotifyService.getCurrentState();
    const {
      track_window: {
        current_track: {
          name: songName,
          album: {
            images: albumImgs,
          },
          artists,
        },
      },
      paused,
    } = result;
    const artistsDisplay = artists.map(({ name }) => name).join(', ');
    this.setState({
      songName,
      albumImg: albumImgs[0].url,
      artistsDisplay,
      isPlaying: !paused,
    });
  }

  togglePlay = async () => {
    await SpotifyService.player.togglePlay();
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });
  }

  render() {
    const {
      isPlaying,
      albumImg,
      artistsDisplay,
      songName,
    } = this.state;

    const { isLoading } = this.props;

    if (isLoading) {
      return <Loader active inline="centered" />;
    }
    return (
      <Card centered>
        <Segment inverted textAlign="center">
          <Image src={albumImg} />
          <Header as="h3">{songName}</Header>
          <Header as="h4" inverted color="grey">{artistsDisplay}</Header>
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
  isLoading: state.spotify.isLoading,
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
