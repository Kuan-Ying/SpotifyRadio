import React from 'react';
import PropType from 'prop-types';

import Text from './Text';

const getMinsAndSecs = (duration) => {
  const mins = Math.floor(duration / 1000 / 60);
  const secs = Math.ceil((duration / 1000) - (mins * 60));
  return { mins, secs };
};

export default function DurationInfo({ duration, isPlaying }) {
  const { mins, secs } = getMinsAndSecs(duration);
  return (
    <Text
      isPlaying={isPlaying}
      activecolor="#42f46e"
      inactivecolor="grey"
      floated="right"
    >
      {mins}:{secs}
    </Text>
  );
}

DurationInfo.propTypes = {
  duration: PropType.number.isRequired,
  isPlaying: PropType.bool.isRequired,
};
