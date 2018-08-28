import { combineReducers } from 'redux';
import spotify from './modules/spotify';
import room from './modules/room';
import user from './modules/user';

export default combineReducers({
  spotify,
  room,
  user,
});
