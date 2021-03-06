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
import { roomIdSelector } from './room';

// NOTE: shared selectors
export const isLoadingPlayerSelector = state => state.spotify.isLoading;

export const currentPlayerStateSelector = state => state.spotify.playerState;

export const currentTrackSelector = state => state.spotify.currentTrack;

export const isSearchingSelector = state => state.spotify.isSearching;

export const searchedTracksSelector = state => state.spotify.searchedTracks;

export const currentPlayQueueSelector = state => state.spotify.playQueue;

// NOTE: Actions
const FETCH_CURRENT_TRACK = actionTypesCreator('FETCH_CURRENT_TRACK');
const FETCH_PLAY_QUEUE = actionTypesCreator('FETCH_PLAY_QUEUE');
const ADD_TRACK_TO_PLAY_QUEUE = actionTypesCreator('ADD_TRACK_TO_PLAY_QUEUE');
const REMOVE_TRACK_FROM_PLAY_QUEUE = actionTypesCreator('REMOVE_TRACK_FROM_PLAY_QUEUE');
const PREVIOUS_TRACK = actionTypesCreator('PREVIOUS_TRACK');
const NEXT_TRACK = actionTypesCreator('NEXT_TRACK');
const SEARCH_TRACKS = actionTypesCreator('SEARCH_TRACKS');

const INIT_PLAYER = actionTypesCreator('INIT_PLAYER');
const PLAY = actionTypesCreator('PLAY');
const SEEK = actionTypesCreator('SEEK');
const TOGGLE_PLAY = actionTypesCreator('TOGGLE_PLAY');
const GET_CURRENT_PLAYER_STATE = actionTypesCreator('GET_CURRENT_PLAYER_STATE');


export const SpotifyActionCreators = createActions(
  ...Object.values(FETCH_PLAY_QUEUE),
  ...Object.values(ADD_TRACK_TO_PLAY_QUEUE),
  ...Object.values(REMOVE_TRACK_FROM_PLAY_QUEUE),
  ...Object.values(PREVIOUS_TRACK),
  ...Object.values(NEXT_TRACK),
  ...Object.values(SEARCH_TRACKS),

  ...Object.values(INIT_PLAYER),
  ...Object.values(PLAY),
  ...Object.values(SEEK),
  ...Object.values(TOGGLE_PLAY),
  ...Object.values(GET_CURRENT_PLAYER_STATE),
);

// NOTE: Sagas
function* fetchCurrentTrack() {
  const roomId = yield select(roomIdSelector);
  const remoteCurrentTrack = yield call(PlayerAPI.fetchCurrentTrack, roomId);
  const localCurrentTrack = yield select(currentTrackSelector);
  const { position: localPosition } = yield select(currentPlayerStateSelector);
  if (!_.isEmpty(remoteCurrentTrack)) {
    const { spotifyUri, positionMs: remotePosition } = remoteCurrentTrack;
    if (!_.isEmpty(localCurrentTrack)
      && localCurrentTrack.uri === spotifyUri
      && Math.abs(localPosition - remotePosition) < 1000) {
      return;
    }
    yield call(SpotifyService.play, { spotifyUri, positionMs: remotePosition });
  }
}

function* fetchPlayQueue() {
  try {
    const roomId = yield select(roomIdSelector);
    const result = yield call(PlayerAPI.fetchPlayQueue, roomId);
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
    const roomId = yield select(roomIdSelector);
    yield call(PlayerAPI.addTrackToPlayQueue, { roomId, trackData });
    yield put(SpotifyActionCreators.addTrackToPlayQueueSuccess());
    yield put(SpotifyActionCreators.fetchPlayQueueRequest());
  } catch (e) {
    yield put(SpotifyActionCreators.addTrackToPlayQueueFailure(e));
  }
}

function* removeTrackFromPlayQueue({ payload: trackId }) {
  try {
    const roomId = yield select(roomIdSelector);
    yield call(PlayerAPI.removeTrackFromPlayQueue, { roomId, trackId });
    yield put(SpotifyActionCreators.removeTrackFromPlayQueueSuccess());
    yield put(SpotifyActionCreators.fetchPlayQueueRequest());
  } catch (e) {
    yield put(SpotifyActionCreators.removeTrackFromPlayQueueFailure(e));
  }
}

function* previousTrack() {
  try {
    const roomId = yield select(roomIdSelector);
    const queue = yield call(PlayerAPI.fetchPlayQueue, roomId);
    const { index } = yield call(PlayerAPI.fetchCurrentTrack, roomId);
    const updatedTrack = queue[((_.size(queue) + index) - 1) % _.size(queue)];
    const track = {
      ...updatedTrack,
      index: _.findIndex(queue, updatedTrack),
    };
    yield call(PlayerAPI.updateCurrentTrack, { roomId, track });
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
    const roomId = yield select(roomIdSelector);
    const queue = yield call(PlayerAPI.fetchPlayQueue, roomId);
    const { index } = yield call(PlayerAPI.fetchCurrentTrack, roomId);
    const updatedTrack = queue[(index + 1) % _.size(queue)];
    const track = {
      ...updatedTrack,
      index: _.findIndex(queue, updatedTrack),
    };
    yield call(PlayerAPI.updateCurrentTrack, { roomId, track });
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

function* getCurrentPlayerState() {
  try {
    const queue = yield select(currentPlayQueueSelector);
    const roomId = yield select(roomIdSelector);
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
      const track = {
        spotifyUri,
        durationMs,
        songName,
        positionMs,
        index: _.findIndex(queue, ({ spotifyUri: target }) => target === spotifyUri),
      };
      yield call(PlayerAPI.updateCurrentTrack, { roomId, track });
      if (!result.paused && positionMs >= durationMs - 600) {
        yield put(SpotifyActionCreators.nextTrackRequest());
      }
    }
    yield put(SpotifyActionCreators.getCurrentPlayerStateSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.getCurrentPlayerStateFailure(e));
  }
}

function getCurrentPlayerStateChannel(roomId) {
  return eventChannel((emit) => {
    // NOTE: synchronize player state for every 1s.
    setInterval(() => {
      emit(GET_CURRENT_PLAYER_STATE.REQUEST);
    }, 600);
    SpotifyService.player.on('player_state_changed', () => emit(GET_CURRENT_PLAYER_STATE.REQUEST));
    PlayerAPI.addPlayQueueListener({
      roomId,
      callback: () => emit(FETCH_PLAY_QUEUE.REQUEST),
    });
    PlayerAPI.addPlayQueueListener({
      roomId,
      callback: () => emit(FETCH_CURRENT_TRACK.REQUEST),
    });
    return () => {};
  });
}

function* watchPlayerStateChange() {
  const roomId = yield select(roomIdSelector);
  const changeChannel = yield call(getCurrentPlayerStateChannel, roomId);
  while (true) {
    const action = yield take(changeChannel);
    if (action === GET_CURRENT_PLAYER_STATE.REQUEST) {
      yield call(getCurrentPlayerState);
    }
    if (action === FETCH_PLAY_QUEUE.REQUEST) {
      yield call(fetchPlayQueue);
    }
    if (action === FETCH_CURRENT_TRACK.REQUEST) {
      yield call(fetchCurrentTrack);
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
    const result = yield call(SpotifyService.initPlayerAsync, 'Spotify Radio');
    yield call(fetchCurrentTrack);
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

export const SpotifySagas = [
  takeLatest(FETCH_PLAY_QUEUE.REQUEST, fetchPlayQueue),
  takeLatest(ADD_TRACK_TO_PLAY_QUEUE.REQUEST, addTrackToPlayQueue),
  takeLatest(REMOVE_TRACK_FROM_PLAY_QUEUE.REQUEST, removeTrackFromPlayQueue),

  takeLatest(PREVIOUS_TRACK.REQUEST, previousTrack),
  takeLatest(NEXT_TRACK.REQUEST, nextTrack),
  takeLatest(SEARCH_TRACKS.REQUEST, searchTracks),

  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
  takeLatest(SEEK.REQUEST, seek),
  takeLatest(TOGGLE_PLAY.REQUEST, togglePlay),
];

// NOTE: reducer
const initialState = {
  isLoading: false,
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
    ...(error ? {
      error: payload,
    } : {
      error: null,
    }),
  }),
  [GET_CURRENT_PLAYER_STATE.SUCCESS]: (state, { payload }) => ({
    ...state,
    playerState: payload || {},
    currentTrack: payload && payload.track_window ? payload.track_window.current_track : {},
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
