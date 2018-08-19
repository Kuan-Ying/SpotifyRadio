import _ from 'lodash';
import { createSelector } from 'reselect';

import { currentPlayerStateSelector } from '../../redux/modules/spotify';

export const currentTrackInfoSelector = createSelector([
  currentPlayerStateSelector,
], (playerState) => {
  if (_.isEmpty(playerState)) {
    return {
      songName: '',
      albumImg: '',
      artistsDisplayName: '',
      paused: true,
    };
  }
  const {
    track_window: {
      current_track: {
        name: songName,
        album: {
          images: albumImgs,
        },
        artists,
      },
    },
    paused,
    position: positionMs,
    duration: durationMs,
  } = playerState;
  const artistsDisplayName = artists.map(({ name }) => name).join(', ');
  return {
    songName,
    albumImg: albumImgs[0].url,
    artistsDisplayName,
    isPlaying: !paused,
    positionMs: positionMs || 0,
    durationMs: durationMs || 0,
  };
});

// TODO: currently playlist is not added in reducer, need to refactor this logic
export const playListSelector = createSelector(currentTrackInfoSelector,
  trackInfo => [trackInfo]);
