import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_ban_room = (params: {
  userId: string;
  roomId: string;
  banId: string;
}) => {
  return async (argument: t_argument) => {
    // 追放者ロック
    const _baninfo = await users_rock({
      argument: argument,
      userId: params.banId
    });

    // 部屋ロック
    const _roominfo = await room_rock({
      argument: argument,
      roomId: params.roomId,
      userId: params.banId
    });

    // ホストか
    if (_roominfo[0].hostId !== params.userId) {
      throw new Error('l_ban_room ホスト権限がない');
    }

    // 部屋ブラックリスト入り
    await argument.model.room_bls.insert({
      roomId: params.roomId,
      userId: params.banId,
      ip: _baninfo.ip
    });

    // 退室させる
    await argument.model.users.updateRoomId(
      { userId: params.banId },
      { roomId: null }
    );

    // 追放されましたメッセージ
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: null,
      userName: 'system',
      iconId: 0,
      ip: '0.0.0.0',
      kind: 0,
      message: `${_baninfo.name}さんが追放されました`
    });

    // 追放者ロック解除
    await argument.model.trans.delete({ id: params.banId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });

    // 追放者のsocketidを返す
    const _ban_cons = await argument.model.cons.findIp({ ip: _baninfo.ip });
    if (_ban_cons.length > 0) {
      return _ban_cons[0].socketId;
    } else {
      return null;
    }
  };
};
