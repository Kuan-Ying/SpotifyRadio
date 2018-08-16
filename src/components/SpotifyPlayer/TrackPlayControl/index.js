import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Dimmer,
  Icon,
  Segment,
  Header,
} from 'semantic-ui-react';

// TODO: add next song, previous song, current play status
export default class TrackPlayControl extends React.Component {
  static propTypes = {
    trackInfo: PropTypes.object.isRequired,
    togglePlay: PropTypes.func.isRequired,
  };

  state = {
    active: false,
  };

  render() {
    const {
      trackInfo: {
        albumImg,
        songName,
        artistsDisplayName,
        isPlaying,
      },
      togglePlay,
    } = this.props;
    const { active } = this.state;
    return (
      <Segment inverted clearing>
        <Dimmer.Dimmable
          dimmed={active}
          as={Image}
          src={albumImg}
          floated="left"
          dimmer={{ active,
            content: (
              <Icon
                name={isPlaying ? 'pause circle outline' : 'play circle outline'}
                size="big"
                onClick={togglePlay}
              />
            ) }}
          onMouseEnter={() => this.setState({ active: true })}
          onMouseLeave={() => this.setState({ active: false })}
        />
        <Header inverted as="h5" floated="left">
          {songName}
          <Header.Subheader color="grey">{artistsDisplayName}</Header.Subheader>
        </Header>
      </Segment>
    );
  }
}
