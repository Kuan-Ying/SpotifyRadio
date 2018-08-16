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

export const SpotifyActionCreators = createActions(
  ...Object.values(INIT_PLAYER),
  ...Object.values(PLAY),
  ...Object.values(TOGGLE_PLAY),
  ...Object.values(GET_CURRENT_PLAYER_STATE),
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
    SpotifyService.player.on('player_state_changed', emit);
    return () => {};
  });
}

function* watchPlayerStateChange() {
  const changeChaneel = yield call(getCurrentPlayerStateChannel);
  while (true) {
    yield take(changeChaneel);
    yield call(getCurrentPlayerState);
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
    yield SpotifyService.player.togglePlay();
    yield put(SpotifyActionCreators.togglePlaySuccess());
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.togglePlayFailure(e));
  }
}

export const SpotifySagas = [
  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
  takeLatest(TOGGLE_PLAY.REQUEST, togglePlay),
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
  } = playerState;
  const artistsDisplayName = artists.map(({ name }) => name).join(', ');
  return {
    songName,
    albumImg: albumImgs[1].url,
    artistsDisplayName,
    isPlaying: !paused,
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
