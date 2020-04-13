import { t_argument } from 'src/mongodb';

/**
 * ギミック
 * @param str
 */
const gimmick = (str: string) => {
  const omikuji_arr = ['大吉', '中吉', '小吉', '吉', '半吉', '末吉', '末小吉'];

  const dice_arr = [1, 2, 3, 4, 5, 6];

  switch (str) {
    case 'サイコロ':
      return `サイコロを振って${
        dice_arr[Math.floor(Math.random() * dice_arr.length)]
      }が出ました`;

    case 'おみくじ':
      return `おみくじの結果: ${
        omikuji_arr[Math.floor(Math.random() * omikuji_arr.length)]
      }`;

    default:
      return null;
  }
};

export const l_talk_insert = (params: {
  roomId: string;
  userId: string;
  ip: string;
  message: string;
}) => {
  return async (argument: t_argument) => {
    // 部屋情報
    const _roominfo = await argument.model.users.aggregate_roominfo({
      roomId: params.roomId
    });

    // ユーザ情報
    const _userinfo = _roominfo.find(m => m.userId === params.userId);

    if (_userinfo === undefined) {
      throw new Error('l_talk_insert ユーザが部屋にいない');
    }

    // 投稿
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: params.userId,
      userName: _userinfo.userName,
      iconId: _userinfo.iconId,
      ip: params.ip,
      kind: 0,
      message: params.message
    });

    // ギミック
    const _gim = gimmick(params.message);
    if (_gim !== null) {
      await argument.model.talks.insert({
        roomId: params.roomId,
        roomName: _roominfo[0].roomName,
        userId: null,
        userName: 'system',
        iconId: 0,
        ip: '0.0.0.0',
        kind: 0,
        message: _gim
      });
    }
  };
};
