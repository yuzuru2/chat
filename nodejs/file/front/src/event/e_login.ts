/**
 * store
 */
import { store } from 'src';

/**
 * socket
 */
import { socket } from 'src/socketio';

/**
 * action_reducer
 */
import { a_login } from 'src/action_reducer/r_login';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * ログイン画面イベント
 */
export const e_login = {
  // アイコン選択時
  set_icon_id: (icon_id: number) =>
    store.dispatch(a_login.login_icon_id(icon_id)),

  // 名前入力時
  set_name: (name: string) => store.dispatch(a_login.login_name(name)),

  // はじめるボタン押下時
  submit: async () =>
    store.getState().r_login.login_name.length === 0
      ? alert('名前を入力してください')
      : socket.emit(constant.URL_LOGIN, {
          name: store.getState().r_login.login_name,
          iconId: store.getState().r_login.login_icon_id
        })
};
