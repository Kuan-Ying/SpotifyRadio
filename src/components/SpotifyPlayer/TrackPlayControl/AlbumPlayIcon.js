import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  Dimmer,
  Icon,
} from 'semantic-ui-react';

const AlbumPlayIcon = ({
  active,
  isPlaying,
  togglePlay,
  albumImg,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Dimmer.Dimmable
    dimmed={active}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <Image src={albumImg} size="small" />
    <Dimmer active={active}>
      <Icon
        name={isPlaying ? 'pause circle outline' : 'play circle outline'}
        size="huge"
        onClick={togglePlay}
      />
    </Dimmer>
  </Dimmer.Dimmable>
);

export default AlbumPlayIcon;

AlbumPlayIcon.propTypes = {
  active: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  togglePlay: PropTypes.func.isRequired,
  albumImg: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};
