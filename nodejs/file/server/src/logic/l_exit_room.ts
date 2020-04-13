import { t_argument } from 'src/mongodb';
import { users_rock, room_rock } from 'src/logic/parts';

export const l_exit_room = (params: {
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
      roomId: params.roomId,
      userId: params.userId
    });

    // 退室
    await argument.model.users.updateRoomId(
      { userId: params.userId },
      { roomId: null }
    );

    // 残りの人数1以上 かつ　ホストなら権限移譲
    if (_roominfo.length - 1 >= 1 && _roominfo[0].hostId == params.userId) {
      // 新しいホスト
      const _newhost = _roominfo.find(m => m.userId !== params.userId);

      // 権限移譲
      await argument.model.rooms.updateHostId(
        { roomId: params.roomId },
        { hostId: _newhost.userId }
      );

      // 権限移譲メッセージ
      await argument.model.talks.insert({
        roomId: params.roomId,
        roomName: _roominfo[0].roomName,
        userId: null,
        userName: 'system',
        iconId: 0,
        ip: '0.0.0.0',
        kind: 0,
        message: `${_newhost.userName}さんに権限が委譲しました`
      });
    }

    // 退室メッセージ
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: null,
      userName: 'system',
      iconId: 0,
      ip: '0.0.0.0',
      kind: 0,
      message: `${_userinfo.name}さんが退室しました`
    });

    // 人数0なら部屋消滅
    if (_roominfo.length - 1 === 0) {
      // 既読削除
      await argument.model.kidokus.delete({ roomId: params.roomId });

      // 部屋ブラックリスト削除
      await argument.model.room_bls.delete({ roomId: params.roomId });

      // 部屋削除
      await argument.model.rooms.delete({ roomId: params.roomId });
    }

    // ユーザロック解除
    await argument.model.trans.delete({ id: params.userId });

    // 部屋ロック解除
    await argument.model.trans.delete({ id: params.roomId });
  };
};
