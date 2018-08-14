import React, { Component } from 'react';
import {
  Loader,
  Image,
  Icon,
  Segment,
  Card,
  Header,
} from 'semantic-ui-react';

import SpotifyService from '../lib/SpotifyService';

export default class extends Component {
  state = {
    isLoading: true,
    isPlaying: false,

    // NOTE: should fetch spotifyUri from firebase
    spotifyUri: 'spotify:track:6i87BCsPUiPLtBqTEK6Y4A',
    positionMs: 0,
    albumImg: '',
    artistsDisplay: '',
  };

  async componentDidMount() {
    await SpotifyService.initPlayerAsync('Kuan\'s player');
    await this.handlePlay();
    this.setState({ isLoading: false });
    SpotifyService.player.on('player_state_changed', this.getCurrentTrackInfo);
  }

  getCurrentTrackInfo = async () => {
    const result = await SpotifyService.getCurrentTrackInfo();
    const {
      name: songName,
      album: {
        images: albumImgs,
      },
      artists,
    } = result;
    const artistsDisplay = artists.map(({ name }) => name).join(', ');
    this.setState({
      songName,
      albumImg: albumImgs[0].url,
      artistsDisplay,
    });
  }

  handlePlay = async () => {
    const { spotifyUri, positionMs } = this.state;
    await SpotifyService.play({ spotifyUri, positionMs });
    this.setState({ isPlaying: true });
    await this.getCurrentTrackInfo();
  }

  togglePlay = async () => {
    await SpotifyService.player.togglePlay();
    const { isPlaying } = this.state;
    this.setState({ isPlaying: !isPlaying });
  }

  render() {
    const {
      isLoading,
      isPlaying,
      albumImg,
      artistsDisplay,
      songName,
    } = this.state;

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
