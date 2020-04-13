/**
 * history
 */
import { history } from 'src';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_login = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_LOGIN;
  const _correct_url = constant.URL_LOUNGE;

  socket.on(_this_url, async (params: { url: string; jwt_token }) => {
    if (params.url !== _correct_url) {
      history.push(params.url);
      return;
    }

    params.jwt_token !== undefined
      ? localStorage.setItem(constant.JWT_TOKEN, params.jwt_token)
      : '';

    socket.disconnect();
  });
};
