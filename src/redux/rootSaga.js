import { all } from 'redux-saga/effects';
import { SpotifySagas } from './modules/spotify';

export default function* rootSagas() {
  yield all([
    ...SpotifySagas,
  ]);
}
