/**
 * store history
 */
import { store, history } from 'src';

/**
 * interface
 */
import { i_q_room_member } from 'src/interface';

/**
 * action_reducer
 */
import { a_lounge } from 'src/action_reducer/r_lounge';
import { a_create_room } from 'src/action_reducer/r_create_room';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_lounge = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_LOUNGE;
  const _correct_url = constant.URL_LOUNGE;

  socket.on(
    _this_url,
    async (params: { url: string; room_list: i_q_room_member[] }) => {
      if (params.url !== _correct_url) {
        history.push(params.url);
        return;
      }

      if (location.pathname === constant.URL_LOUNGE) {
        store.dispatch(a_lounge.set_room_list(params.room_list, true));
      } else {
        store.dispatch(a_create_room.create_room_display(true));
      }
    }
  );
};
