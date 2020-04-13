import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_entering_room = (params: {
  userId: string;
  roomId: string;
  ip: string;
}) => {
  return async (argument: t_argument) => {
    // ユーザロック
    const _userinfo = await users_rock({
      argument: argument,
      userId: params.userId
    });

    // 部屋ロック
    const _roominfo = await room_rock({
      argument: argument,
      roomId: params.roomId
    });

    // 部屋ブラックリストでないか
    if (
      (await argument.model.room_bls.find({
        roomId: params.roomId,
        userId: params.userId,
        ip: params.ip
      })).length > 0
    ) {
      throw new Error('l_entering_room 部屋ブラックリストが来た');
    }

    // 名前とアイコンが同じなら入室できない
    if (
      _roominfo.find(
        m => m.userName === _userinfo.name && m.iconId === _userinfo.iconId
      ) !== undefined
    ) {
      throw new Error(
        'l_entering_room 名前とアイコンが同じユーザいるなら入室できない'
      );
    }

    // 入室できるか
    if (_roominfo.length >= _roominfo[0].upper) {
      throw new Error(
        'l_entering_room 人数が上限以上になっているため入室できない'
      );
    }

    // 入室
    await argument.model.users.updateRoomId(
      { userId: params.userId },
      { roomId: params.roomId }
    );

    // 入室しました
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: null,
      userName: 'system',
      iconId: 0,
      ip: '0.0.0.0',
      kind: 0,
      message: `${_userinfo.name}さんが入室しました`
    });

    // ユーザロック解除
    await argument.model.trans.delete({ id: params.userId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });
  };
};
