/**
 * store
 */
import { store } from 'src';

/**
 * action_reducer
 */
import { a_create_room } from 'src/action_reducer/r_create_room';

/**
 * socket
 */
import { socket } from 'src/socketio';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * 部屋作成画面イベント
 */
export const e_create_room = {
  // 部屋名入力時
  set_name: (name: string) =>
    store.dispatch(a_create_room.create_room_name(name)),

  // 部屋上限選択時
  set_upper: (upper: number) =>
    store.dispatch(a_create_room.create_room_upper(upper)),

  // 部屋をつくるボタン押下時
  submit: async (name: string, upper: number) =>
    name.length === 0
      ? alert('部屋名を入力してください')
      : socket.emit(constant.URL_CREATE_ROOM, { upper: upper, name: name })
};
