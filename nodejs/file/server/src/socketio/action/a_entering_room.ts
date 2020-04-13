/**
 * エラーログ
 */
import { write_error_log } from 'src/util';

/**
 * db
 */
import { Mongodb, t_argument } from 'src/mongodb';

/**
 * logic
 */
import { l_after_second } from 'src/logic/l_after_second';
import { l_entering_room } from 'src/logic/l_entering_room';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const a_entering_room = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_ENTERING_ROOM;
  const _correct_url = constant.URL_LOUNGE;

  params.socket.on(_this_url, async (req: { roomId: string }) => {
    try {
      const _ret = await l_after_second({
        jwt_token: params.jwt_token,
        ip: params.ip
      });

      if (_ret.url !== _correct_url) {
        params.socket.emit(_this_url, _ret);
        return;
      }

      // 入室
      await new Mongodb<void>().transactionMethod(
        l_entering_room({
          userId: _ret.userId,
          roomId: req.roomId,
          ip: params.ip
        })
      );

      // レスポンス
      params.socket.emit(_this_url, { url: constant.URL_ROOM });

      // ブロードキャスト
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        const _list = await argument.model.users.aggregate_member_socket({
          roomId: req.roomId
        });

        _list.map(m =>
          m.socketId.length !== 0 && m.userId !== _ret.userId
            ? params.io.to(m.socketId[0]).emit(constant.URL_OBSERVER_ROOM, {})
            : ''
        );
      });
    } catch (e) {
      params.socket.disconnect();
      await write_error_log(e);
    }
  });
};
