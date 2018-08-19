import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import DurationInfo from './DurationInfo';
import PlayStatus from './PlayStatus';
import Text from './Text';

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
      <List divided inverted relaxed style={{ height: 100, overflowY: 'scroll' }}>
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
      </List>
    );
  }
}
