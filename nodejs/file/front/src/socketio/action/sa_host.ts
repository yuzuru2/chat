/**
 * history
 */
import { history } from 'src';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const sa_host = async (socket: SocketIOClient.Socket) => {
  const _this_url = constant.URL_UPDATE_HOST_ROOM;
  const _correct_url = constant.URL_ROOM;

  socket.on(_this_url, async (params: { url: string }) => {
    if (params.url !== _correct_url) {
      history.push(params.url);
      return;
    }

    socket.emit(_correct_url, {});
  });
};
