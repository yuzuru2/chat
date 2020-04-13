import { t_argument } from 'src/mongodb';

/**
 * 部屋ロック
 * @param params
 */
export const room_rock = async (params: {
  argument: t_argument;
  roomId: string;
  userId?: string;
}) => {
  const users = params.argument.model.users;
  const trans = params.argument.model.trans;

  // 部屋ロック
  await trans.insert({ id: params.roomId });

  const _roominfo = await users.aggregate_roominfo({ roomId: params.roomId });
  if (_roominfo.length === 0) {
    throw new Error('room_rock 部屋が存在しない');
  }

  if (params.userId !== undefined) {
    if (_roominfo.map(m => m.userId === params.userId) === undefined) {
      throw new Error('room_rock ユーザが部屋にいない');
    }
  }

  return _roominfo;
};

/**
 * ユーザロック
 * @param params
 */
export const users_rock = async (params: {
  argument: t_argument;
  userId: string;
}) => {
  const users = params.argument.model.users;
  const trans = params.argument.model.trans;

  // ユーザロック
  await trans.insert({ id: params.userId });

  // ユーザ情報
  const _userinfo = await users.findUser({ userId: params.userId });

  if (_userinfo.length === 0) {
    throw new Error('users_rock  ユーザが存在しない');
  }

  return _userinfo[0];
};
