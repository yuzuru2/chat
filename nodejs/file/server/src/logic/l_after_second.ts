import { Mongodb } from 'src/mongodb';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * logic
 */
import { l_every } from 'src/logic/l_every';

export const l_after_second = async (params: {
  jwt_token: string;
  ip: string;
}) => {
  const _ret = await new Mongodb<{
    userId: string;
    roomId: string;
  }>().normalMethod(l_every(params));

  if (_ret === undefined) {
    throw new Error('l_after_second ブラックリストがアクセスしてきた');
  }

  if (_ret === null) {
    // root
    return { url: constant.URL_ROOT, userId: null, roomId: null };
  }

  if (_ret.roomId === null) {
    // lounge
    return { url: constant.URL_LOUNGE, userId: _ret.userId, roomId: null };
  }

  // room
  return { url: constant.URL_ROOM, userId: _ret.userId, roomId: _ret.roomId };
};
