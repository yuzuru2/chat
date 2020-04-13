import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_update_hostId = (params: {
  userId: string;
  roomId: string;
  new_hostId: string;
}) => {
  return async (argument: t_argument) => {
    // 新ホストロック
    const _new_hostinfo = await users_rock({
      argument: argument,
      userId: params.new_hostId
    });

    // 部屋ロック
    const _roominfo = await room_rock({
      argument: argument,
      roomId: params.roomId,
      userId: params.new_hostId
    });

    // ホストか
    if (_roominfo[0].hostId !== params.userId) {
      throw new Error('l_update_hostId ホスト権限がない');
    }

    // 権限移譲
    await argument.model.rooms.updateHostId(
      { roomId: params.roomId },
      { hostId: params.new_hostId }
    );

    // 権限移譲メッセージ
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: null,
      userName: 'system',
      iconId: 0,
      ip: '0.0.0.',
      kind: 0,
      message: `${_new_hostinfo.name}さんに権限が委譲しました`
    });

    // 新ホストロック解除
    await argument.model.trans.delete({ id: params.new_hostId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });
  };
};
