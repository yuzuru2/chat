import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_update_roomName = (params: {
  userId: string;
  roomId: string;
  new_name: string;
}) => {
  return async (argument: t_argument) => {
    // ユーザロック
    await users_rock({
      argument: argument,
      userId: params.userId
    });

    // 部屋ロック
    const _roominfo = await room_rock({
      argument: argument,
      roomId: params.roomId,
      userId: params.userId
    });

    // ホストか
    if (_roominfo[0].hostId !== params.userId) {
      throw new Error('l_update_roomName ホスト権限がない');
    }

    // 部屋名変更
    const _ret = await argument.model.rooms.updateName(
      { roomId: params.roomId },
      { name: params.new_name }
    );

    _ret !== 0
      ? await argument.model.talks.insert({
          roomId: params.roomId,
          roomName: _roominfo[0].roomName,
          userId: null,
          userName: 'system',
          iconId: 0,
          ip: '0.0.0.0',
          kind: 0,
          message: `「${params.new_name}」に部屋名が変更されました`
        })
      : '';

    // ユーザロック解除
    await argument.model.trans.delete({ id: params.userId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });
  };
};
