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

export const a_lounge = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_LOUNGE;
  const _correct_url = constant.URL_LOUNGE;

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

      // レスポンス
      params.socket.emit(_this_url, {
        url: _correct_url,
        room_list: await new Mongodb<
          {
            roomId: string;
            roomName: string;
            userId: string;
            userName: string;
            iconId: number;
            upper: number;
            hostId: string;
          }[]
        >().normalMethod(async (argument: t_argument) => {
          return await argument.model.users.aggregate_roominfo();
        })
      });
    } catch (e) {
      params.socket.disconnect();
      await write_error_log(e);
    }
  });
};
