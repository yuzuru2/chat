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

export const a_logout = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_LOGOUT;
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

      // ログアウト
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        await argument.model.users.deleteUser({ userId: _ret.userId });
      });

      params.socket.emit(_this_url, { url: constant.URL_ROOT });
    } catch (e) {
      params.socket.disconnect();
      await write_error_log(e);
    }
  });
};
