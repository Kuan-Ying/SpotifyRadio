import {
  createActions,
  handleActions,
  combineActions,
} from 'redux-actions';
import { eventChannel } from 'redux-saga';
import {
  put,
  call,
  take,
  takeLatest,
  select,
} from 'redux-saga/effects';
import uuid from 'uuid';

import actionTypesCreator from '../../helpers/actionTypesCreator';
import RoomAPI from '../../API/RoomAPI';
import NavigationService from '../../services/NavigationService';

import { currentUserInfoSelector } from './user';

// NOTE: shared selectors
export const roomIdSelector = state => state.room.roomId;

export const warnSelector = state => state.room.warn;

export const messagesSelector = state => state.room.messages;

export const isLoadingMessagesSelector = state => state.room.isLoading;

// NOTE: actions
const ENTER_ROOM = actionTypesCreator('ENTER_ROOM');
const CREATE_ROOM = actionTypesCreator('CREATE_ROOM');
const FETCH_MESSAGES = actionTypesCreator('FETCH_MESSAGES');
const POST_MESSAGE = actionTypesCreator('POST_MESSAGE');

export const RoomActionCreators = createActions(
  ...Object.values(ENTER_ROOM),
  ...Object.values(CREATE_ROOM),
  ...Object.values(FETCH_MESSAGES),
  ...Object.values(POST_MESSAGE),
);

// NOTE: Sagas
function* createRoom() {
  const roomId = uuid.v4();
  try {
    yield call(RoomAPI.createRoom, roomId);
    yield put(RoomActionCreators.createRoomSuccess({ error: false }));
    NavigationService.history.push(`/radio/${roomId}`);
  } catch (e) {
    console.log(e);
    yield put(RoomActionCreators.createRoomFailure({ error: true, warn: e }));
  }
}

function* fetchMessages() {
  try {
    const roomId = yield select(roomIdSelector);
    const result = yield call(RoomAPI.fetchMessages, roomId);
    yield put(RoomActionCreators.fetchMessagesSuccess({ data: result || [] }));
  } catch (e) {
    yield put(RoomActionCreators.fetchMessagesFailure({ error: true, warn: e }));
  }
}

function* postMessage({ payload: message }) {
  try {
    const roomId = yield select(roomIdSelector);
    const { display_name: name, images } = yield select(currentUserInfoSelector);
    const newMessage = {
      name,
      message,
      timestamp: Date.now(),
      image: images[0].url,
    };
    yield call(RoomAPI.postMessage, { roomId, message: newMessage });
    yield put(RoomActionCreators.postMessageSuccess({}));
  } catch (e) {
    yield put(RoomActionCreators.postMessageFailure({ error: true, warn: e }));
  }
}

function watchMessagesChannel(roomId) {
  return eventChannel((emit) => {
    RoomAPI.addChatRoomListener({
      roomId,
      callback: () => emit(FETCH_MESSAGES.REQUEST),
    });
    return () => {};
  });
}

function* watchMessagesChange() {
  const roomId = yield select(roomIdSelector);
  const changeChannel = yield call(watchMessagesChannel, roomId);
  while (true) {
    const action = yield take(changeChannel);
    if (action === FETCH_MESSAGES.REQUEST) {
      yield call(fetchMessages);
    }
  }
}

function* enterRoom({ payload: roomId }) {
  const result = yield call(RoomAPI.isRoomIdValid, roomId);
  if (!result) {
    const warn = `Room id ${roomId} does not exist.`;
    yield put(RoomActionCreators.enterRoomFailure({ roomId, error: true, warn }));
    setTimeout(() => NavigationService.history.replace('/'), 3000);
  } else {
    yield put(RoomActionCreators.enterRoomSuccess({ roomId, error: false }));
    yield put(RoomActionCreators.fetchMessagesRequest());
    yield call(watchMessagesChange);
  }
}

export const RoomSagas = [
  takeLatest(ENTER_ROOM.REQUEST, enterRoom),
  takeLatest(CREATE_ROOM.REQUEST, createRoom),
  takeLatest(FETCH_MESSAGES.REQUEST, fetchMessages),
  takeLatest(POST_MESSAGE.REQUEST, postMessage),
];

// NOTE: reducers
const initialState = {
  roomId: null,
  error: false,
  warn: '',
  messages: [],
  isLoading: false,
};

export default handleActions({
  [combineActions(
    ENTER_ROOM.SUCCESS,
    ENTER_ROOM.FAILURE
  )]: (state, { payload: { roomId, error, warn } }) => ({
    ...state,
    ...(!error ? { roomId } : {
      warn,
      error,
    }),
  }),
  [combineActions(
    CREATE_ROOM.SUCCESS,
    CREATE_ROOM.FAILURE
  )]: (state, { payload: { error, warn } }) => ({
    ...state,
    ...(error ? {
      warn,
      error,
    } : {}),
  }),

  [combineActions(
    POST_MESSAGE.SUCCESS,
    POST_MESSAGE.FAILURE
  )]: (state, { payload: { error, warn } }) => ({
    ...state,
    ...(error ? {
      warn,
      error,
    } : {}),
  }),

  [FETCH_MESSAGES.REQUEST]: state => ({
    ...state,
    isLoading: true,
  }),
  [combineActions(
    FETCH_MESSAGES.SUCCESS,
    FETCH_MESSAGES.FAILURE
  )]: (state, { payload: { data, error, warn } }) => ({
    ...state,
    isLoading: false,
    ...(error ? {
      warn,
      error,
    } : {
      messages: data,
    }),
  }),
}, initialState);
