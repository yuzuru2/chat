/**
 * コアモジュール
 */
import * as io from 'socket.io-client';
import ifvisible from 'ifvisible.js';

/**
 * store
 */
import { store } from 'src';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * action
 */
import { a_global } from 'src/action_reducer/r_global';

/**
 * sockt action
 */
import { sa_ban } from 'src/socketio/action/sa_ban';
import { sa_create_room } from 'src/socketio/action/sa_create_room';
import { sa_entering_room } from 'src/socketio/action/sa_entering_room';
import { sa_exit_room } from 'src/socketio/action/sa_exit_room';
import { sa_host } from 'src/socketio/action/sa_host';
import { sa_kidoku } from 'src/socketio/action/sa_kidoku';
import { sa_login } from 'src/socketio/action/sa_login';
import { sa_logout } from 'src/socketio/action/sa_logout';
import { sa_lounge } from 'src/socketio/action/sa_lounge';
import { sa_room_name } from 'src/socketio/action/sa_room_name';
import { sa_room } from 'src/socketio/action/sa_room';
import { sa_root } from 'src/socketio/action/sa_root';
import { sa_text_insert } from 'src/socketio/action/sa_text_insert';
import { sa_upload } from 'src/socketio/action/sa_upload';
import { sa_upper } from './action/sa_upper';

// 画面がアクティブ: true
let display_flag = true;

// 接続
export const socket = io.connect(constant.REQUEST_URL[process.env.NODE_ENV], {
  transports: ['websocket'],
  query: {
    [constant.JWT_TOKEN]: localStorage.getItem(constant.JWT_TOKEN)
  }
});

// 退室
sa_exit_room(socket);

// 入室
sa_entering_room(socket);

// 投稿
sa_text_insert(socket);

// 画像うｐ
sa_upload(socket);

// 既読処理
sa_kidoku(socket);

// 追放
sa_ban(socket);

// 部屋ホスト変更
sa_host(socket);

// 部屋名変更
sa_room_name(socket);

// 部屋上限人数変更
sa_upper(socket);

// ログイン
sa_login(socket);

// ログアウト
sa_logout(socket);

// 部屋作成
sa_create_room(socket);

// root
sa_root(socket);

// 部屋リスト
sa_lounge(socket);

// 部屋情報
sa_room(socket);

/**
 * socket接続時
 */
socket.on(constant.URL_AUTH, async () => {
  store.dispatch(store.dispatch(a_global.set_first(true)));
});

/**
 * 部屋でブロードキャスト受信時
 */
socket.on(constant.URL_OBSERVER_ROOM, async () => {
  if (location.pathname === '/room') {
    socket.emit(constant.URL_CREATE_KIDOKU, {});
  }
});

/**
 * 切断時
 */
socket.on('disconnect', async () => {
  store.dispatch(store.dispatch(a_global.set_first(false)));
  socket.disconnect();
});

/**
 * ソケット監視
 */
const surveillance = async () => {
  if (display_flag && !socket.connected) {
    // 再接続
    socket.io.opts.query = {
      [constant.JWT_TOKEN]: localStorage.getItem(constant.JWT_TOKEN)
    };
    socket.connect();
  }
  setTimeout(surveillance, 250);
};

/**
 * 画面がアクティブになったとき
 */
ifvisible.on('focus', async function() {
  display_flag = true;
});

/**
 * 画面が非アクティブになったとき
 */
ifvisible.on('blur', async function() {
  display_flag = false;
  socket.disconnect();
});

// socket監視開始
surveillance();

export const socket_empty = () => {};
