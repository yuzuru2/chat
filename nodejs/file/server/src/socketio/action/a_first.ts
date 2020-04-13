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
import { l_every } from 'src/logic/l_every';
import { l_first } from 'src/logic/l_first';

export const a_first = async (params: {
  socket_list: string[];
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  next: () => void;
}) => {
  try {
    // 接続できるか
    if (
      (await new Mongodb<boolean>().normalMethod(
        l_first({
          socket_list: params.socket_list,
          ip: params.ip
        })
      )) === false
    ) {
      return;
    }

    const _ret = await new Mongodb<{
      userId: string;
      roomId: string;
    }>().normalMethod(
      l_every({
        jwt_token: params.jwt_token,
        ip: params.ip
      })
    );

    if (_ret === undefined) {
      return;
    }

    if (_ret === null) {
      // socket.id保存
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        await argument.model.cons.insert({
          socketId: params.socket.id,
          userId: null,
          ip: params.ip
        });
      });
    } else {
      // socket.id保存
      await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
        await argument.model.cons.insert({
          socketId: params.socket.id,
          userId: _ret.userId,
          ip: params.ip
        });
      });
    }

    params.next();
  } catch (e) {
    await write_error_log(e);
  }
};
