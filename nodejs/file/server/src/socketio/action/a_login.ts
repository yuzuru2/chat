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

// jwt
import { encode } from 'src/jwt';

export const a_login = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_LOGIN;
  const _correct_url = constant.URL_ROOT;

  params.socket.on(_this_url, async (req: { name: string; iconId: number }) => {
    try {
      // バリデーション
      if (typeof req.name !== 'string') {
        throw new Error('a_login');
      }

      // バリデーション
      if (typeof req.iconId !== 'number') {
        throw new Error('a_login');
      }

      const _ret = await l_after_second({
        jwt_token: params.jwt_token,
        ip: params.ip
      });

      if (_ret.url !== _correct_url) {
        params.socket.emit(_this_url, _ret);
        return;
      }

      // ユーザ作成
      const _new_userId = await new Mongodb<string>().normalMethod(
        async (argument: t_argument) => {
          return argument.model.users.insert({
            name: req.name,
            iconId: req.iconId,
            ip: params.ip
          });
        }
      );

      // レスポンス
      params.socket.emit(_this_url, {
        url: constant.URL_LOUNGE,
        jwt_token: encode({ userId: _new_userId }, constant.PRIVATE_KEY)
      });
    } catch (e) {
      params.socket.disconnect();
      await write_error_log(e);
    }
  });
};
