/**
 * コアモジュール
 */
import { combineReducers, Dispatch } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';

/**
 * reducer
 */
import r_global, { i_global } from 'src/action_reducer/r_global';
import r_login, { i_login } from 'src/action_reducer/r_login';
import r_lounge, { i_lounge } from 'src/action_reducer/r_lounge';
import r_create_room, { i_create_room } from 'src/action_reducer/r_create_room';
import r_room, { i_room } from 'src/action_reducer/r_room/index';
import r_chat, { i_chat } from 'src/action_reducer/r_room/r_chat';
import r_chat_detail, {
  i_chat_detail
} from 'src/action_reducer/r_room/r_chat_detail';

/**
 * Props
 */
export interface Props {
  dispatch: Dispatch;
  history: History;
  r_global: i_global;
  r_login: i_login;
  r_lounge: i_lounge;
  r_create_room: i_create_room;
  r_room: i_room;
  r_chat: i_chat;
  r_chat_detail: i_chat_detail;
}

export default history =>
  combineReducers({
    router: connectRouter(history),
    r_global,
    r_login,
    r_lounge,
    r_create_room,
    r_room,
    r_chat,
    r_chat_detail
  });
