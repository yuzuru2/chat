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

export const a_room = async (params: {
  socket: SocketIO.Socket;
  jwt_token: string;
  ip: string;
  io: SocketIO.Server;
}) => {
  const _this_url = constant.URL_ROOM;
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

      params.socket.emit(_this_url, {
        url: _correct_url,
        user_id: _ret.userId,
        room_member: await new Mongodb<
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
          return argument.model.users.aggregate_roominfo({
            roomId: _ret.roomId
          });
        }),
        talk_list: await new Mongodb<
          {
            talkId: string;
            userId: string;
            userName: string;
            iconId: number;
            message: string;
            kind: number;
            kidokus: string[];
            createdAt: Date;
          }[]
        >().normalMethod(async (argument: t_argument) => {
          return await argument.model.talks.aggregate_talk({
            roomId: _ret.roomId
          });
        })
      });
    } catch (e) {
      params.socket.disconnect();
      await write_error_log(e);
    }
  });
};
