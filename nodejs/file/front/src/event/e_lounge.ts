/**
 * history
 */
import { history } from 'src';

/**
 * api
 */
import { socket } from 'src/socketio';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * ラウンジ画面イベント
 */
export const e_lounge = {
  // ログアウトボタン押下時
  logout: async () =>
    window.confirm('ログアウトしますか?')
      ? socket.emit(constant.URL_LOGOUT, {})
      : '',

  // 入室ボタン押下時
  entering_room: async (room_id: string) =>
    window.confirm('入室しますか?')
      ? socket.emit(constant.URL_ENTERING_ROOM, { roomId: room_id })
      : '',

  // 部屋をつくるボタン押下時
  create_room: () => history.push(constant.URL_CREATE_ROOM)
};
