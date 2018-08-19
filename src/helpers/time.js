import moment from 'moment';

/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
export const getDurationDisplay = time => moment(moment.duration(time)._data).format('mm:ss');
