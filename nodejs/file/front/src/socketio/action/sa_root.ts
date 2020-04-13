/**
 * store history
 */
import { store, history } from 'src';

/**
 * action_reducer
 */
import { a_login } from 'src/action_reducer/r_login';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_root = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_ROOT;
  const _correct_url = constant.URL_ROOT;

  socket.on(_this_url, async (params: { url: string }) => {
    if (params.url !== _correct_url) {
      history.push(params.url);
      return;
    }

    store.dispatch(a_login.login_display(true));
  });
};
