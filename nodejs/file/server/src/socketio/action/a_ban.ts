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
import { l_ban_room } from 'src/logic/l_ban_room';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const a_ban = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_BAN_ROOM;
  const _correct_url = constant.URL_ROOM;

  params.socket.on(_this_url, async (req: { banId: string }) => {
    try {
      // バリデーション
      if (typeof req.banId !== 'string') {
        throw new Error('a_ban');
      }

      const _ret = await l_after_second({
        jwt_token: params.jwt_token,
        ip: params.ip
      });

      if (_ret.url !== _correct_url) {
        params.socket.emit(_this_url, _ret);
        return;
      }

      // 追放
      const _ban_ret = await new Mongodb<string>().transactionMethod(
        l_ban_room({
          userId: _ret.userId,
          roomId: _ret.roomId,
          banId: req.banId
        })
      );

      // 追放者に伝える
      if (_ban_ret != null) {
        params.io.to(_ban_ret).emit(constant.URL_OBSERVER_ROOM, {});
      }

      // レスポンス
      params.socket.emit(_this_url, { url: _correct_url });

      // ブロードキャスト
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        const _list = await argument.model.users.aggregate_member_socket({
          roomId: _ret.roomId
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
