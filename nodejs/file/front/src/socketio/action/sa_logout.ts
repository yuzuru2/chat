/**
 * history
 */
import { history } from 'src';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_logout = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_LOGOUT;
  const _correct_url = constant.URL_ROOT;

  socket.on(_this_url, async (params: { url: string }) => {
    if (params.url !== _correct_url) {
      history.push(params.url);
      return;
    }

    socket.disconnect();
  });
};
