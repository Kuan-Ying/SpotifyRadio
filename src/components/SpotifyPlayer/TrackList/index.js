import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

import DurationInfo from './DurationInfo';
import PlayStatus from './PlayStatus';
import Text from './Text';
import OptionDropdown from './OptionDropdown';

const StyledList = styled(List).attrs({
  divided: true,
  inverted: true,
  relaxed: true,
  celled: true,
})`
  height: 200px;
  overflow-y: auto;
`;

const PlayIcon = styled(List.Icon).attrs({
  name: 'play circle outline',
  inverted: true,
  floated: 'left',
})`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
`;

const StyledSpan = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block !important;
  width: 200px;
  overflow: hidden;
`;

const SongName = styled(({ isPlaying, name }) => (
  <Text
    isPlaying={isPlaying}
    activecolor="#42f46e"
    inactivecolor="grey"
  >
    <StyledSpan>{name}</StyledSpan>
  </Text>
))``;

export default class extends React.Component {
  static propTypes = {
    tracks: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
  };

  static defaultProps = {
    tracks: [],
  };

  state = {
    showOptionsAt: -1,
    showPlayIconAt: -1,
  };

  render() {
    const {
      tracks,
      onRemove,
      onPlay,
    } = this.props;
    const {
      showOptionsAt,
      showPlayIconAt,
    } = this.state;
    return (
      <StyledList>
        {
          tracks.map(({ id, spotifyUri, songName, durationMs, isPlaying }, index) => (
            <List.Item
              key={songName}
              onMouseEnter={() => this.setState({ showOptionsAt: index, showPlayIconAt: index })}
              onMouseLeave={() => this.setState({ showOptionsAt: -1, showPlayIconAt: -1 })}
              onDoubleClick={() => onPlay(spotifyUri)}
            >
              <List.Content floated="right" >
                <OptionDropdown
                  visible={showOptionsAt === index}
                  onClick={() => onRemove(id)}
                />
              </List.Content>
              <DurationInfo isPlaying={isPlaying} duration={durationMs} />
              <PlayStatus isPlaying={isPlaying} index={index} />
              <PlayIcon
                onClick={() => onPlay(spotifyUri)}
                visible={showPlayIconAt === index && !isPlaying ? 1 : 0}
              />
              <SongName
                isPlaying={isPlaying}
                name={songName}
              />
            </List.Item>))
        }
      </StyledList>
    );
  }
}
