/**
 * store history
 */
import { store, history } from 'src';

/**
 * interface
 */
import { i_q_room_member, i_q_talk_list } from 'src/interface';

/**
 * action_reducer
 */
import { a_room } from 'src/action_reducer/r_room';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_room = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_ROOM;
  const _correct_url = constant.URL_ROOM;

  socket.on(
    _this_url,
    async (params: {
      url: string;
      room_member: i_q_room_member[];
      talk_list: i_q_talk_list[];
      user_id: string;
    }) => {
      if (params.url !== _correct_url) {
        history.push(params.url);
        return;
      }

      store.dispatch(
        a_room.room_data({
          room_member: params.room_member,
          talk_list: params.talk_list,
          user_id: params.user_id,
          display: true
        })
      );
    }
  );
};
