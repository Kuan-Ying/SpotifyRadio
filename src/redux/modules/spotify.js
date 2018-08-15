import {
  createActions,
  combineActions,
  handleActions,
} from 'redux-actions';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';

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

function* initPlayer({ payload: { playerStateChangedCb } }) {
  try {
    const result = yield call(SpotifyService.initPlayerAsync, 'Kuan\'s player');
    const spotifyUri = 'spotify:track:6i87BCsPUiPLtBqTEK6Y4A';
    yield put(SpotifyActionCreators.playRequest({ spotifyUri, positionMs: 0 }));
    SpotifyService.player.on('player_state_changed', playerStateChangedCb);
    yield put(SpotifyActionCreators.initPlayerSuccess(result));
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
      || result.status !== 204
      || result.status !== 202) {
      yield put(SpotifyActionCreators.playFailure(result));
      return;
    }
    yield put(SpotifyActionCreators.playSuccess(result));
  } catch (e) {
    console.log(e);
    yield put(SpotifyActionCreators.playFailure(e));
  }
}

export const SpotifySagas = [
  takeLatest(INIT_PLAYER.REQUEST, initPlayer),
  takeLatest(PLAY.REQUEST, play),
];


// NOTE: reducer
const initialState = {
  isLoading: false,
  error: null,
  data: null,
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
      data: null,
    } : {
      error: null,
      data: payload,
    }),
  }),
}, initialState);
