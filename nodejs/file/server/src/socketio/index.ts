// npm i --save socket.io @types/socket.io socket.io-redis

/**
 * コアモジュール
 */
import * as socketio from 'socket.io';
import * as redis from 'socket.io-redis';
import * as http from 'http';
import * as fs from 'fs';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * db
 */
import { Mongodb, t_argument } from 'src/mongodb';

/**
 * action
 */
import { a_ban } from 'src/socketio/action/a_ban';
import { a_create_room } from 'src/socketio/action/a_create_room';
import { a_entering_room } from 'src/socketio/action/a_entering_room';
import { a_exit_room } from 'src/socketio/action/a_exit_room';
import { a_host } from 'src/socketio/action/a_host';
import { a_kidoku } from 'src/socketio/action/a_kidoku';
import { a_login } from 'src/socketio/action/a_login';
import { a_logout } from 'src/socketio/action/a_logout';
import { a_lounge } from 'src/socketio/action/a_lounge';
import { a_room_name } from 'src/socketio/action/a_room_name';
import { a_room } from 'src/socketio/action/a_room';
import { a_root } from 'src/socketio/action/a_root';
import { a_talk_insert } from 'src/socketio/action/a_talk_insert';
import { a_upload } from 'src/socketio/action/a_upload';
import { a_first } from 'src/socketio/action/a_first';
import { a_upper } from './action/a_upper';

interface i_io extends SocketIO.Server {
  set: (key: string, value: number | string) => void;
  NextFunction: () => void;
}

interface i_socket_adapter extends socketio.Adapter {
  clients: (arg0: (err: any, clients: string[]) => void) => void;
}

interface i_socket extends SocketIO.Handshake {
  query: {
    jwt_token: string;
  };
}

/**
 * httpサーバ起動
 */
const io = socketio(
  http.createServer().listen(constant.PORT[process.env.NODE_ENV])
) as i_io;

/**
 * socket.io-redis設定
 */
io.adapter(
  redis(
    JSON.parse(
      fs.readFileSync(`${process.cwd()}/config/database.json`, 'utf-8')
    )['redis'][process.env.NODE_ENV]
  )
);

/**
 * オリジン
 */
if (process.env.NODE_ENV === 'production') {
  io.set('origins', constant.ORIGIN[process.env.NODE_ENV]);
}

/**
 * タイムアウトを5秒に設定する
 */
io.set('heartbeat timeout', 5000);
io.set('heartbeat interval', 5000);

/**
 * IPアドレス取得
 * @param socket
 */
export const get_ip = (socket: SocketIO.Socket): string => {
  let _ip: string =
    socket.request.headers['x-forwarded-for'] ||
    socket.request.connection.remoteAddress;
  if (_ip.substr(0, 7) == '::ffff:') {
    _ip = _ip.substr(7);
  }

  return _ip;
};

/**
 * ミドルウエア
 */
io.use((socket: SocketIO.Socket, next: i_io['NextFunction']) => {
  const _adapter = io.of('/').adapter as i_socket_adapter;
  const _handshake = socket.handshake as i_socket;

  _adapter.clients(async (err, clients) => {
    await a_first({
      socket_list: clients,
      jwt_token: _handshake.query.jwt_token,
      socket: socket,
      ip: get_ip(socket),
      next: next
    });
  });
});

/**
 * connection
 */
io.on('connection', (socket: SocketIO.Socket) => {
  socket.emit(constant.URL_AUTH, {});

  /**
   * 定期パラメータ取得
   * @param socket
   */
  const get_regular = () => {
    const _handshake = socket.handshake as i_socket;

    return {
      socket: socket,
      jwt_token: _handshake.query.jwt_token,
      ip: get_ip(socket),
      io: io
    };
  };

  // 退室 b
  a_exit_room(get_regular());

  // 入室 b
  a_entering_room(get_regular());

  // 投稿 b
  a_talk_insert(get_regular());

  // 画像うｐ b
  a_upload(get_regular());

  // 既読処理 b
  a_kidoku(get_regular());

  // 追放 b
  a_ban(get_regular());

  // 部屋ホスト変更 b
  a_host(get_regular());

  // 部屋名変更 b
  a_room_name(get_regular());

  // 部屋上限人数変更 b
  a_upper(get_regular());

  // ログイン
  a_login(get_regular());

  // ログアウト
  a_logout(get_regular());

  // 部屋作成
  a_create_room(get_regular());

  // root
  a_root(get_regular());

  // 部屋リスト
  a_lounge(get_regular());

  // 部屋情報
  a_room(get_regular());

  // 切断
  socket.on(
    'disconnect',
    async () =>
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        await argument.model.cons.delete({ socketId: socket.id });
      })
  );
});

/**
 * 初回処理
 */
export const init = async () => {
  await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
    await argument.model.cons.delete();
  });
};

console.log(process.env.NODE_ENV);
