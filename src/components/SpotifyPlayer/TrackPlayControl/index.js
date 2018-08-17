import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

import AlbumPlayIcon from './AlbumPlayIcon';
import ProgressBar from './ProgressBar';
import TrackInfo from './TrackInfo';

const FlexRow = styled.div`
  display: flex;
  align-items: stretch;
  min-height: 5px;
  background: ${({ color }) => (color ? `${color}` : 'transparent')};
`;

const FlewColumn = styled.div`
  flex-direction: column;
  min-height: 5px;
  padding: 5px;
`;

const ControlButton = styled(Icon)`
  color: ${({ active }) => (active ? 'white' : '#3f3f3f')};
`;

// TODO: add next song, previous song, current play status
export default class TrackPlayControl extends React.Component {
  static propTypes = {
    trackInfo: PropTypes.object.isRequired,
    togglePlay: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
  };

  static defaultProps = {
    trackInfo: {
      albumImg: 'https://i.scdn.co/image/7d9fada23c7044da31f8f687c84292885c180488',
      songName: 'Lost Stars',
      artistsDisplayName: 'Adam Levine',
      isPlaying: true,
    },
    togglePlay: () => {},
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
      onPrevious,
      onNext,
    } = this.props;
    const {
      playButtonActive,
      prevButtonActive,
      nextButtonActive,
    } = this.state;

    return (
      <FlexRow color="#1b1c1d">
        <AlbumPlayIcon
          albumImg={albumImg}
          isPlaying={isPlaying}
          active={playButtonActive}
          togglePlay={togglePlay}
          onMouseEnter={() => this.setState({ playButtonActive: true })}
          onMouseLeave={() => this.setState({ playButtonActive: false })}
        />
        <FlewColumn>
          <TrackInfo songName={songName} artistsDisplayName={artistsDisplayName} />
          <FlexRow style={{ alignItems: 'center' }}>
            <ControlButton
              name="step backward"
              onClick={onPrevious}
              active={prevButtonActive}
              onMouseEnter={() => this.setState({ prevButtonActive: true })}
              onMouseLeave={() => this.setState({ prevButtonActive: false })}
            />
            <ProgressBar percent={20} />
            <ControlButton
              name="step forward"
              active={nextButtonActive}
              onClick={onNext}
              onMouseEnter={() => this.setState({ nextButtonActive: true })}
              onMouseLeave={() => this.setState({ nextButtonActive: false })}
            />
          </FlexRow>
        </FlewColumn>
      </FlexRow>
    );
  }
}
