import _ from 'lodash';
import { createSelector } from 'reselect';

import {
  currentPlayerStateSelector,
  currentPlayQueueSelector,
} from '../../redux/modules/spotify';

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
        uri: spotifyUri,
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
    spotifyUri,
    albumImg: albumImgs[0].url,
    artistsDisplayName,
    isPlaying: !paused,
    positionMs: positionMs || 0,
    durationMs: durationMs || 0,
  };
});

export const playQueueSelector = createSelector([
  currentTrackInfoSelector,
  currentPlayQueueSelector,
], ({ spotifyUri, isPlaying }, queue) => _.map(queue,
  track => ({ ...track, isPlaying: spotifyUri === track.spotifyUri && isPlaying })
));
