import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_entering_room } from 'src/logic/l_entering_room';
import { l_update_hostId } from 'src/logic/l_update_hostId';

describe('l_update_hostId', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('通常', async () => {
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

    // user1作成
    const _userId1 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user1',
          ip: '2.2.2.2'
        });
      }
    );

    // user1入室
    await new Mongodb<void>().normalMethod(
      l_entering_room({ userId: _userId1, roomId: _roomId, ip: '2.2.2.2' })
    );

    // 権限移譲
    await new Mongodb<void>().normalMethod(
      l_update_hostId({
        userId: _userId0,
        roomId: _roomId,
        new_hostId: _userId1
      })
    );

    // 権限移譲されているか
    expect(
      await new Mongodb<string>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.rooms.find({ roomId: _roomId }))[0].hostId;
      })
    ).toEqual(_userId1);

    // 入室 権限移譲　合計2件メッセージが挿入されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(2);
  });
});

describe('l_update_hostId', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('ホストでないユーザが権限移譲したら', async () => {
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

    // user1作成
    const _userId1 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user1',
          ip: '2.2.2.2'
        });
      }
    );

    // user1入室
    await new Mongodb<void>().normalMethod(
      l_entering_room({ userId: _userId1, roomId: _roomId, ip: '2.2.2.2' })
    );

    // 権限移譲
    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(
        l_update_hostId({
          userId: _userId1,
          roomId: _roomId,
          new_hostId: _userId0
        })
      )
      .catch(e => (_ret = false));
    expect(_ret).toEqual(false);
  });
});

describe('l_update_hostId', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('部屋にいないユーザに権限移譲したら', async () => {
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

    // 権限移譲
    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(
        l_update_hostId({
          userId: _userId0,
          roomId: _roomId,
          new_hostId: 'error_id'
        })
      )
      .catch(e => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
