import { all } from 'redux-saga/effects';
import { SpotifySagas } from './modules/spotify';
import { RoomSagas } from './modules/room';
import { UserSagas } from './modules/user';

export default function* rootSagas() {
  yield all([
    ...SpotifySagas,
    ...RoomSagas,
    ...UserSagas,
  ]);
}
