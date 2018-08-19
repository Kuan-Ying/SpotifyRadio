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
} from 'redux-saga/effects';
import { createSelector } from 'reselect';

import SpotifyService from '../../services/SpotifyService';
import actionTypesCreator from '../../helpers/actionTypesCreator';

const INIT_PLAYER = actionTypesCreator('INIT_PLAYER');
const PLAY = actionTypesCreator('PLAY');
const TOGGLE_PLAY = actionTypesCreator('TOGGLE_PLAY');
const GET_CURRENT_PLAYER_STATE = actionTypesCreator('GET_CURRENT_PLAYER_STATE');
const PREVIOUS_TRACK = actionTypesCreator('PREVIOUS_TRACK');
const NEXT_TRACK = actionTypesCreator('NEXT_TRACK');

export const SpotifyActionCreators = createActions(
  ...Object.values(INIT_PLAYER),
  ...Object.values(PLAY),
  ...Object.values(TOGGLE_PLAY),
  ...Object.values(GET_CURRENT_PLAYER_STATE),
  ...Object.values(PREVIOUS_TRACK),
  ...Object.values(NEXT_TRACK),
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

export const SpotifySagas = [
  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
  takeLatest(TOGGLE_PLAY.REQUEST, togglePlay),
  takeLatest(PREVIOUS_TRACK.REQUEST, previousTrack),
  takeLatest(NEXT_TRACK.REQUEST, nextTrack),
];

// NOTE: selectors
export const isLoadingPlayerSelector = state => state.spotify.isLoading;

export const currentPlayerStateSelector = state => state.spotify.playerState;

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

// NOTE: reducer
const initialState = {
  isLoading: false,
  error: null,
  playerState: {},
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
}, initialState);
