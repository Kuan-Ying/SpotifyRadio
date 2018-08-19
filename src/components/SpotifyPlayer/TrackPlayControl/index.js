import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';

import AlbumPlayIcon from './AlbumPlayIcon';
import ProgressBar from './ProgressBar';
import TrackInfo from './TrackInfo';

const FlexRow = styled.div`
  display: flex;
  min-height: 5px;
  background: ${({ color }) => (color ? `${color}` : 'transparent')};
`;

const FlewColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 5px;
  padding: 5px;
`;

const TimeDisplay = styled.div`
  color: #9b9da0;
  font-size: 12px;
`;

const ControlButton = styled(Icon)`
  color: ${({ active }) => (active ? 'white' : '#9b9da0')};
`;

/* eslint-disable no-underscore-dangle */
const getTimeDisplay = time => moment(moment.duration(time)._data).format('mm:ss');

export default class TrackPlayControl extends React.Component {
  static propTypes = {
    trackInfo: PropTypes.object.isRequired,
    togglePlay: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    positionMs: PropTypes.number.isRequired,
    durationMs: PropTypes.number.isRequired,
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
        positionMs,
        durationMs,
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
    const percent = (positionMs) ? (positionMs * 100) / durationMs : 0;

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
          <TrackInfo style={{ alignSelf: 'start' }} songName={songName} artistsDisplayName={artistsDisplayName} />
          <FlexRow style={{ alignItems: 'center', alignSelf: 'flex-end' }}>
            <TimeDisplay>{getTimeDisplay(positionMs)}</TimeDisplay>
            <ControlButton
              name="step backward"
              onClick={onPrevious}
              active={prevButtonActive ? 1 : 0}
              onMouseEnter={() => this.setState({ prevButtonActive: true })}
              onMouseLeave={() => this.setState({ prevButtonActive: false })}
            />
            <ProgressBar style={{ paddingTop: 1 }} percent={percent} />
            <ControlButton
              name="step forward"
              active={nextButtonActive ? 1 : 0}
              onClick={onNext}
              onMouseEnter={() => this.setState({ nextButtonActive: true })}
              onMouseLeave={() => this.setState({ nextButtonActive: false })}
            />
            <TimeDisplay>{getTimeDisplay(durationMs)}</TimeDisplay>
          </FlexRow>
        </FlewColumn>
      </FlexRow>
    );
  }
}
