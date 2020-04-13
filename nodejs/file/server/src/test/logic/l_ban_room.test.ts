import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_ban_room } from 'src/logic/l_ban_room';

describe('l_ban_room', () => {
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
          name: 'user0',
          ip: '11.11.11.11'
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

    // user1を追放
    await new Mongodb<string>().normalMethod(
      l_ban_room({ userId: _userId0, roomId: _roomId, banId: _userId1 })
    );

    // user1が退室されているか
    expect(
      await new Mongodb<string>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.findUser({ userId: _userId1 }))[0]
          .roomId;
      })
    ).toEqual(null);

    // 部屋ブラックリストに入っているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.room_bls.find({
          userId: _userId1,
          roomId: _roomId,
          ip: '11.11.11.11'
        })).length;
      })
    ).toEqual(1);
  });
});

describe('l_ban_room', () => {
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

    // user1作成
    const _userId1 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user0',
          ip: '11.11.11.11'
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

    // 追放
    let _ret = true;
    await new Mongodb<string>()
      .normalMethod(
        l_ban_room({ userId: _userId1, roomId: _roomId, banId: _userId0 })
      )
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);
  });
});

describe('l_ban_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('部屋にいないユーザを追放した時エラー', async () => {
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

    // 追放
    let _ret = true;
    await new Mongodb<string>()
      .normalMethod(
        l_ban_room({ userId: _userId0, roomId: _roomId, banId: 'tuihou' })
      )
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
