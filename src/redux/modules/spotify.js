import _ from 'lodash';
import {
  createActions,
  combineActions,
  handleActions,
} from 'redux-actions';
import { eventChannel } from 'redux-saga';
import {
  call,
  put,
  take,
  takeLatest,
  select,
} from 'redux-saga/effects';

import SpotifyService from '../../services/SpotifyService';
import PlayerAPI from '../../API/PlayerAPI';
import actionTypesCreator from '../../helpers/actionTypesCreator';

// NOTE: shared selectors
export const isPlayingPlayerSelector = state => state.spotify.isPlaying;
export const isLoadingPlayerSelector = state => state.spotify.isLoading;

export const currentPlayerStateSelector = state => state.spotify.playerState;

export const currentTrackSelector = state => state.spotify.playerState.track_window.current_track;

export const isSearchingSelector = state => state.spotify.isSearching;

export const searchedTracksSelector = state => state.spotify.searchedTracks;

export const currentPlayQueueSelector = state => state.spotify.playQueue;

// TODO: add maintain queue actions
const INIT_PLAYER = actionTypesCreator('INIT_PLAYER');
const PLAY = actionTypesCreator('PLAY');
const SEEK = actionTypesCreator('SEEK');
const TOGGLE_PLAY = actionTypesCreator('TOGGLE_PLAY');
const GET_CURRENT_PLAYER_STATE = actionTypesCreator('GET_CURRENT_PLAYER_STATE');
const PREVIOUS_TRACK = actionTypesCreator('PREVIOUS_TRACK');
const NEXT_TRACK = actionTypesCreator('NEXT_TRACK');
const SEARCH_TRACKS = actionTypesCreator('SEARCH_TRACKS');
const FETCH_PLAY_QUEUE = actionTypesCreator('FETCH_PLAY_QUEUE');
const ADD_TRACK_TO_PLAY_QUEUE = actionTypesCreator('ADD_TRACK_TO_PLAY_QUEUE');
const REMOVE_TRACK_FROM_PLAY_QUEUE = actionTypesCreator('REMOVE_TRACK_FROM_PLAY_QUEUE');

export const SpotifyActionCreators = createActions(
  ...Object.values(INIT_PLAYER),
  ...Object.values(PLAY),
  ...Object.values(SEEK),
  ...Object.values(TOGGLE_PLAY),
  ...Object.values(GET_CURRENT_PLAYER_STATE),
  ...Object.values(PREVIOUS_TRACK),
  ...Object.values(NEXT_TRACK),
  ...Object.values(SEARCH_TRACKS),
  ...Object.values(FETCH_PLAY_QUEUE),
  ...Object.values(ADD_TRACK_TO_PLAY_QUEUE),
  ...Object.values(REMOVE_TRACK_FROM_PLAY_QUEUE),
);

// NOTE: Sagas
function* synchronizeFromFirebase() {
  yield put(SpotifyActionCreators.fetchPlayQueueRequest());
  const currentTrack = yield call(PlayerAPI.fetchCurrentTrack);
  if (!_.isEmpty(currentTrack)) {
    const { spotifyUri, positionMs } = currentTrack;
    yield call(SpotifyService.play, { spotifyUri, positionMs });
  }
}

function* getCurrentPlayerState() {
  try {
    const queue = yield select(currentPlayQueueSelector);
    const result = yield call(SpotifyService.getCurrentState);
    if (!_.isEmpty(result) && !_.isEmpty(queue)) {
      const {
        track_window: {
          current_track: {
            uri: spotifyUri,
            name: songName,
          },
        },
        duration: durationMs,
        position: positionMs,
      } = result;
      yield call(PlayerAPI.updateCurrentTrack, {
        spotifyUri,
        durationMs,
        songName,
        positionMs,
        index: _.findIndex(queue, ({ spotifyUri: target }) => target === spotifyUri),
      });
      if (yield select(isPlayingPlayerSelector) && positionMs >= durationMs - 600) {
        yield put(SpotifyActionCreators.nextTrackRequest());
      }
    }
    yield put(SpotifyActionCreators.getCurrentPlayerStateSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.getCurrentPlayerStateFailure(e));
  }
}

function getCurrentPlayerStateChannel() {
  return eventChannel((emit) => {
    // NOTE: synchronize player state for every 1s.
    setInterval(() => {
      emit(GET_CURRENT_PLAYER_STATE.REQUEST);
    }, 600);
    SpotifyService.player.on('player_state_changed', () => emit(GET_CURRENT_PLAYER_STATE.REQUEST));
    return () => {};
  });
}

function* watchPlayerStateChange() {
  const changeChannel = yield call(getCurrentPlayerStateChannel);
  while (true) {
    const action = yield take(changeChannel);
    if (action === GET_CURRENT_PLAYER_STATE.REQUEST) {
      yield call(getCurrentPlayerState);
    }
  }
}

function* play({ payload: { spotifyUri, positionMs } }) {
  try {
    const result = yield call(SpotifyService.play, { spotifyUri, positionMs });
    if (result.status !== 200
      && result.status !== 204
      && result.status !== 202) {
      yield put(SpotifyActionCreators.playFailure(result));
      return;
    }
    yield put(SpotifyActionCreators.playSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.playFailure(e));
  }
}

function* seek({ payload: percent }) {
  try {
    const { duration_ms: durationMs } = yield select(currentTrackSelector);
    const positionMs = durationMs * percent;
    yield call(SpotifyService.seek, positionMs);
    yield put(SpotifyActionCreators.seekSuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.seekFailure(e));
  }
}

function* initPlayer() {
  try {
    const result = yield call(SpotifyService.initPlayerAsync, 'Kuan\'s player');
    yield call(synchronizeFromFirebase);
    yield put(SpotifyActionCreators.initPlayerSuccess(result));
    yield call(watchPlayerStateChange);
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.initPlayerFailure(e));
  }
}

function* togglePlay() {
  try {
    if (_.isEmpty(yield select(currentPlayerStateSelector))) {
      const { spotifyUri } = _.head(yield select(currentPlayQueueSelector));
      yield call(play, { payload: { spotifyUri } });
    } else {
      yield call(SpotifyService.togglePlay);
    }
    yield put(SpotifyActionCreators.togglePlaySuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.togglePlayFailure(e));
  }
}

function* previousTrack() {
  try {
    const queue = yield call(PlayerAPI.fetchPlayQueue);
    const { index } = yield call(PlayerAPI.fetchCurrentTrack);
    const updatedTrack = queue[((_.size(queue) + index) - 1) % _.size(queue)];
    yield call(PlayerAPI.updateCurrentTrack, {
      ...updatedTrack,
      index: _.findIndex(queue, updatedTrack),
    });
    const { spotifyUri } = updatedTrack;
    yield put(SpotifyActionCreators.playRequest({ spotifyUri }));
    yield put(SpotifyActionCreators.previousTrackSuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.previousTrackFailure(e));
  }
}

function* nextTrack() {
  try {
    const queue = yield call(PlayerAPI.fetchPlayQueue);
    const { index } = yield call(PlayerAPI.fetchCurrentTrack);
    const updatedTrack = queue[(index + 1) % _.size(queue)];
    yield call(PlayerAPI.updateCurrentTrack, {
      ...updatedTrack,
      index: _.findIndex(queue, updatedTrack),
    });
    const { spotifyUri } = updatedTrack;
    yield put(SpotifyActionCreators.playRequest({ spotifyUri }));
    yield put(SpotifyActionCreators.nextTrackSuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.nextTrackFailure(e));
  }
}

function* searchTracks({ payload: query }) {
  try {
    const result = yield call(SpotifyService.searchTracks, query);
    if (result.status !== 200
      && result.status !== 204
      && result.status !== 202) {
      yield put(SpotifyActionCreators.searchTracksFailure(result.data.error));
      return;
    }
    yield put(SpotifyActionCreators.searchTracksSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.searchTracksFailure(e));
  }
}

function* fetchPlayQueue() {
  try {
    const result = yield call(PlayerAPI.fetchPlayQueue);
    if (!result) {
      yield put(SpotifyActionCreators.fetchPlayQueueFailure('cannot find play queue'));
    }
    yield put(SpotifyActionCreators.fetchPlayQueueSuccess(result));
  } catch (e) {
    yield put(SpotifyActionCreators.fetchPlayQueueFailure(e));
  }
}

function* addTrackToPlayQueue({ payload: trackData }) {
  try {
    yield call(PlayerAPI.addTrackToPlayQueue, trackData);
    yield put(SpotifyActionCreators.addTrackToPlayQueueSuccess());
  } catch (e) {
    yield put(SpotifyActionCreators.addTrackToPlayQueueFailure(e));
  }
}

// TODO: removeTrackFromQueue logic and corresponsing setup in view
function* removeTrackFromPlayQueue() {

}

export const SpotifySagas = [
  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
  takeLatest(SEEK.REQUEST, seek),
  takeLatest(TOGGLE_PLAY.REQUEST, togglePlay),
  takeLatest(PREVIOUS_TRACK.REQUEST, previousTrack),
  takeLatest(NEXT_TRACK.REQUEST, nextTrack),
  takeLatest(SEARCH_TRACKS.REQUEST, searchTracks),
  takeLatest(FETCH_PLAY_QUEUE.REQUEST, fetchPlayQueue),
  takeLatest(ADD_TRACK_TO_PLAY_QUEUE.REQUEST, addTrackToPlayQueue),
  takeLatest(REMOVE_TRACK_FROM_PLAY_QUEUE.REQUEST, removeTrackFromPlayQueue),
];

// NOTE: reducer
const initialState = {
  isLoading: false,
  isPlaying: false,
  isSearching: false,
  error: null,
  playerState: {},
  searchedTracks: [],
  playQueue: [],
};

export default handleActions({
  [INIT_PLAYER.REQUEST]: state => ({
    ...state,
    isLoading: true,
  }),
  [combineActions(
    INIT_PLAYER.SUCCESS,
    INIT_PLAYER.FAILURE,
  )]: (state, { payload, error }) => ({
    ...state,
    isLoading: false,
    isPlaying: true,
    ...(error ? {
      error: payload,
    } : {
      error: null,
    }),
  }),
  [GET_CURRENT_PLAYER_STATE.SUCCESS]: (state, { payload }) => ({
    ...state,
    playerState: payload,
  }),
  [SEARCH_TRACKS.REQUEST]: state => ({
    ...state,
    isSearching: true,
  }),
  [combineActions(
    SEARCH_TRACKS.SUCCESS,
    SEARCH_TRACKS.FAILURE,
  )]: (state, { payload, error }) => ({
    ...state,
    isSearching: false,
    ...(error ? {
      error: payload,
    } : {
      error: null,
      searchedTracks: payload.data,
    }),
  }),
  [FETCH_PLAY_QUEUE.REQUEST]: state => ({
    ...state,
    isLoading: true,
  }),
  [FETCH_PLAY_QUEUE.SUCCESS]: (state, { payload }) => ({
    ...state,
    isLoading: false,
    playQueue: payload,
  }),
}, initialState);
