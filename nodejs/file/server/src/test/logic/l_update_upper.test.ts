import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_update_upper } from 'src/logic/l_update_upper';

describe('l_update_upper', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('通常', async () => {
    // user0作成
    const _userId = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user0',
          ip: '1.1.1.1'
        });
      }
    );

    // 部屋作成
    const _roomId = await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId, upper: 5, name: 'room0' })
    );

    await new Mongodb<void>().normalMethod(
      l_update_upper({ userId: _userId, roomId: _roomId, new_upper: 15 })
    );

    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.rooms.find({ roomId: _roomId }))[0].upper;
      })
    ).toEqual(15);
  });
});

describe('l_update_upper', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('ホストでない', async () => {
    // user0作成
    const _userId0 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user0',
          ip: '1.1.1.1'
        });
      }
    );

    // 部屋作成
    const _roomId = await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId0, upper: 5, name: 'room0' })
    );

    const _userId1 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user1',
          ip: '1.1.1.1'
        });
      }
    );

    // 入室
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.users.updateRoomId(
        { userId: _userId1 },
        { roomId: _roomId }
      );
    });

    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(
        l_update_upper({ userId: _userId1, roomId: _roomId, new_upper: 15 })
      )
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
