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
} from 'redux-saga/effects';

import SpotifyService from '../../services/SpotifyService';
import actionTypesCreator from '../../helpers/actionTypesCreator';

// TODO: add maintain queue actions
const INIT_PLAYER = actionTypesCreator('INIT_PLAYER');
const PLAY = actionTypesCreator('PLAY');
const TOGGLE_PLAY = actionTypesCreator('TOGGLE_PLAY');
const GET_CURRENT_PLAYER_STATE = actionTypesCreator('GET_CURRENT_PLAYER_STATE');
const PREVIOUS_TRACK = actionTypesCreator('PREVIOUS_TRACK');
const NEXT_TRACK = actionTypesCreator('NEXT_TRACK');
const SEARCH_TRACKS = actionTypesCreator('SEARCH_TRACKS');

export const SpotifyActionCreators = createActions(
  ...Object.values(INIT_PLAYER),
  ...Object.values(PLAY),
  ...Object.values(TOGGLE_PLAY),
  ...Object.values(GET_CURRENT_PLAYER_STATE),
  ...Object.values(PREVIOUS_TRACK),
  ...Object.values(NEXT_TRACK),
  ...Object.values(SEARCH_TRACKS),
);


// NOTE: Sagas

function* getCurrentPlayerState() {
  try {
    const result = yield call(SpotifyService.getCurrentState);
    yield put(SpotifyActionCreators.getCurrentPlayerStateSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.getCurrentPlayerStateFailure(e));
  }
}

function getCurrentPlayerStateChannel() {
  return eventChannel((emit) => {
    // // NOTE: synchronize player state for every 1s.
    setInterval(() => {
      emit(GET_CURRENT_PLAYER_STATE.REQUEST);
    }, 1000);
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

function* initPlayer() {
  try {
    const result = yield call(SpotifyService.initPlayerAsync, 'Kuan\'s player');
    const spotifyUri = 'spotify:track:6i87BCsPUiPLtBqTEK6Y4A';
    yield put(SpotifyActionCreators.playRequest({ spotifyUri, positionMs: 0 }));
    yield put(SpotifyActionCreators.initPlayerSuccess(result));
    yield call(watchPlayerStateChange);
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.initPlayerFailure(e));
  }
}

function* play({ payload: { spotifyUri, positionMs } }) {
  try {
    console.log(spotifyUri);
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


function* togglePlay() {
  try {
    yield call(SpotifyService.togglePlay);
    yield put(SpotifyActionCreators.togglePlaySuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.togglePlayFailure(e));
  }
}

function* previousTrack() {
  try {
    yield call(SpotifyService.previousTrack);
    yield put(SpotifyActionCreators.previousTrackSuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.previousTrackFailure(e));
  }
}

function* nextTrack() {
  try {
    yield call(SpotifyService.nextTrack);
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

export const SpotifySagas = [
  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
  takeLatest(TOGGLE_PLAY.REQUEST, togglePlay),
  takeLatest(PREVIOUS_TRACK.REQUEST, previousTrack),
  takeLatest(NEXT_TRACK.REQUEST, nextTrack),
  takeLatest(SEARCH_TRACKS.REQUEST, searchTracks),
];

// NOTE: shared selectors
export const isLoadingPlayerSelector = state => state.spotify.isLoading;

export const currentPlayerStateSelector = state => state.spotify.playerState;

export const isSearchingSelector = state => state.spotify.isSearching;

export const searchedTracksSelector = state => state.spotify.searchedTracks;

// NOTE: reducer
const initialState = {
  isLoading: false,
  isSearching: false,
  error: null,
  playerState: {},
  searchedTracks: [],
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
}, initialState);
