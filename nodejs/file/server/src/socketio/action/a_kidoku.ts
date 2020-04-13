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

/**
 * 定数
 */
import { constant } from 'src/constant';

export const a_kidoku = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_CREATE_KIDOKU;
  const _correct_url = constant.URL_ROOM;

  params.socket.on(_this_url, async () => {
    try {
      const _ret = await l_after_second({
        jwt_token: params.jwt_token,
        ip: params.ip
      });

      if (_ret.url !== _correct_url) {
        params.socket.emit(_this_url, _ret);
        return;
      }

      // 既読処理
      const _kidoku_ret = await new Mongodb<boolean>().normalMethod(
        async (argument: t_argument) => {
          // トーク一覧
          const _talk_list = await argument.model.talks.aggregate_talk({
            roomId: _ret.roomId
          });

          // 既読コレクションに挿入するデータ
          const _arg = _talk_list.reduce(
            (list: { talkId: string; roomId: string; userId: string }[], m) => {
              if (m.userId !== null && m.userId !== _ret.userId) {
                list.push({
                  talkId: m.talkId,
                  roomId: _ret.roomId,
                  userId: _ret.userId
                });
              }

              return list;
            },
            []
          );

          if (_arg.length === 0) {
            return false;
          }

          return await argument.model.kidokus.insert(_arg);
        }
      );

      // レスポンス
      params.socket.emit(_this_url, { url: _correct_url });

      if (_kidoku_ret === false) {
        return;
      }

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
