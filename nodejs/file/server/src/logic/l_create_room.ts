import { t_argument } from 'src/mongodb';

export const l_create_room = (params: {
  hostId: string;
  upper: number;
  name: string;
}) => {
  return async (argument: t_argument) => {
    // 部屋作成
    const _roomId = await argument.model.rooms.insert(params);

    // 入室
    await argument.model.users.updateRoomId(
      { userId: params.hostId },
      { roomId: _roomId }
    );

    return _roomId;
  };
};
