import {
  createActions,
  handleActions,
  combineActions,
} from 'redux-actions';
import {
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';

import SpotifyService from '../../services/SpotifyService';
import actionTypesCreator from '../../helpers/actionTypesCreator';

// NOTE: shared selectors
export const currentUserInfoSelector = state => state.user.userInfo;

// NOTE: Actions
const FETCH_CURRENT_USER_INFO = actionTypesCreator('FETCH_CURRENT_USER_INFO');

export const UserActionCreators = createActions(
  ...Object.values(FETCH_CURRENT_USER_INFO),
);

// NOTE: Sagas
function* fetchCurrentUserInfo() {
  const result = yield call(SpotifyService.getCurrentUserProfile);
  if (result.status !== 200) {
    yield put(UserActionCreators.fetchCurrentUserInfoFailure({
      data: result.data,
      error: result.status,
    }));
  }
  yield put(UserActionCreators.fetchCurrentUserInfoSuccess({ data: result.data }));
}

export const UserSagas = [
  takeLatest(FETCH_CURRENT_USER_INFO.REQUEST, fetchCurrentUserInfo),
];

// NOTE: reducer
const initialState = {
  userInfo: {},
  error: null,
};

export default handleActions({
  [combineActions(
    FETCH_CURRENT_USER_INFO.FAILURE,
    FETCH_CURRENT_USER_INFO.SUCCESS,
  )]: (state, { payload: { data, error } }) => ({
    ...state,
    ...(!error ? { userInfo: data } : {
      error,
    }),
  }),
}, initialState);
