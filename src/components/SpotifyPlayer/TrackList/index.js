import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import DurationInfo from './DurationInfo';
import PlayStatus from './PlayStatus';
import Text from './Text';

const StyledList = styled(List).attrs({
  divided: true,
  inverted: true,
  relaxed: true,
})`
  height: 200px;
  overflow-y: auto;
`;

export default class extends React.Component {
  static propTypes = {
    tracks: PropTypes.array.isRequired,
  }

  static defaultProps = {
    tracks: [],
  }

  render() {
    const { tracks } = this.props;
    return (
      <StyledList>
        {
          tracks.map(({ songName, durationMs, isPlaying }, index) => (
            <List.Item key={songName}>
              <DurationInfo isPlaying={isPlaying} duration={durationMs} />
              <PlayStatus isPlaying={isPlaying} index={index} />
              <Text
                isPlaying={isPlaying}
                activecolor="#42f46e"
                inactivecolor="grey"
              >
                {songName}
              </Text>
            </List.Item>))
        }
      </StyledList>
    );
  }
}
