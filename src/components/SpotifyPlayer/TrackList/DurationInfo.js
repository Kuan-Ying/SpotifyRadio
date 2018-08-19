import React from 'react';
import PropType from 'prop-types';
import moment from 'moment';

import Text from './Text';

/* eslint-disable no-underscore-dangle */
const getTimeDisplay = time => moment(moment.duration(time)._data).format('mm:ss');

export default function DurationInfo({ duration, isPlaying }) {
  return (
    <Text
      isPlaying={isPlaying}
      activecolor="#42f46e"
      inactivecolor="grey"
      floated="right"
    >
      {getTimeDisplay(duration)}
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
