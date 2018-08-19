import _ from 'lodash';
import { createSelector } from 'reselect';
import { searchedTracksSelector } from '../../redux/modules/spotify';

export const extractedSearchedTracksSelectors = createSelector([
  searchedTracksSelector,
], tracks => _.map(tracks, ({
  uri: spotifyUri,
  duration_ms: durationMs,
  name: songName,
  popularity,
  artists,
}) => ({
  spotifyUri,
  durationMs,
  songName,
  popularity,
  artists: artists.map(({ name }) => name),
})));

export const mock = null;
