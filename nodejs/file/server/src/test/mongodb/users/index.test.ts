import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('users', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert findUser findExitUser updateIp updateRoomId aggregate_member_socket aggregate_roominfo deleteUser', async () => {
    let _userId: string;
    let _roomId: string;

    // insert findUser
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        _userId = await argument.model.users.insert({
          iconId: 0,
          name: 'taro',
          ip: '1.1.1.1'
        });
        return (await argument.model.users.findUser({ userId: _userId }))
          .length;
      })
    ).toEqual(1);

    // findExitUser
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.findExitUser()).length;
      })
    ).toEqual(0);

    // updateIp
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.users.updateIp(
          { userId: _userId },
          { ip: '2.2.2.2' }
        );
      })
    ).toEqual(1);

    // updateRoomId
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.users.updateRoomId(
          { userId: _userId },
          { roomId: 'roomId' }
        );
      })
    ).toEqual(1);

    // aggregate_member_socket
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        // cons挿入
        await argument.model.cons.insert({
          socketId: 'a',
          userId: _userId,
          ip: '2.2.2.2'
        });

        // 部屋作成
        _roomId = await argument.model.rooms.insert({
          name: 'room',
          upper: 5,
          hostId: _userId
        });

        // 入室
        await argument.model.users.updateRoomId(
          { userId: _userId },
          { roomId: _roomId }
        );

        return (await argument.model.users.aggregate_member_socket({
          roomId: _roomId
        }))[0].socketId.length;
      })
    ).toEqual(1);

    // aggregate_roominfo
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(1);
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo()).length;
      })
    ).toEqual(1);

    // deleteUser
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.users.deleteUser({ userId: _userId });
      })
    ).toEqual(1);
  });
});
