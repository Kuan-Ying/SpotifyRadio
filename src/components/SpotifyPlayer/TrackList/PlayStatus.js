import React from 'react';
import PropType from 'prop-types';
import { List } from 'semantic-ui-react';

import Text from './Text';

export default function PlayStatus({ index, isPlaying }) {
  if (isPlaying) {
    return (
      <List.Icon
        name="volume up"
        verticalAlign="middle"
        color="green"
      />);
  }
  return (
    <Text
      inactivecolor="grey"
      floated="left"
    >
      {index + 1}
    </Text>
  );
}

PlayStatus.propTypes = {
  index: PropType.number.isRequired,
  isPlaying: PropType.bool.isRequired,
};
