import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_update_upper = (params: {
  userId: string;
  roomId: string;
  new_upper: number;
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
      throw new Error('l_update_upper ホスト権限がない');
    }

    // 上限変更
    const _ret = await argument.model.rooms.updateUpper(
      { roomId: params.roomId },
      { upper: params.new_upper }
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
          message: `部屋の上限人数が「${params.new_upper}」に変更されました`
        })
      : '';

    // ユーザロック解除
    await argument.model.trans.delete({ id: params.userId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });
  };
};
