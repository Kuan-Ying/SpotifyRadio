import React from 'react';
import PropType from 'prop-types';

import Text from './Text';
import { getDurationDisplay } from '../../../helpers/time';

export default function DurationInfo({ duration, isPlaying }) {
  return (
    <Text
      isPlaying={isPlaying}
      activecolor="#42f46e"
      inactivecolor="grey"
      floated="right"
    >
      {getDurationDisplay(duration)}
    </Text>
  );
}

DurationInfo.propTypes = {
  duration: PropType.number,
  isPlaying: PropType.bool,
};

DurationInfo.defaultProps = {
  duration: 0,
  isPlaying: false,
};
