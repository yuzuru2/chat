import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_entering_room } from 'src/logic/l_entering_room';

describe('l_entering_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case1', async () => {
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
          ip: '1.1.1.1'
        });
      }
    );

    // user1入室
    await new Mongodb<void>().transactionMethod(
      l_entering_room({ userId: _userId1, roomId: _roomId, ip: '1.1.1.1' })
    );

    // 部屋の人数が2になっているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(2);

    // 入室メッセージが挿入されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(1);
  });
});

describe('l_entering_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case2 ブラックリストが来たケース', async () => {
    // ユーザ0作成
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
          ip: '11.11.11.11'
        });
      }
    );

    // user1を部屋ブラックリスト入りする
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.room_bls.insert({
        roomId: _roomId,
        userId: _userId1,
        ip: '11.11.11.11'
      });
    });

    // user1入室
    await new Mongodb<void>()
      .transactionMethod(
        l_entering_room({
          userId: _userId1,
          roomId: _roomId,
          ip: '11.11.11.11'
        })
      )
      .catch(e => '');

    // 部屋の人数1になっているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(1);
  });
});

describe('l_entering_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case3 部屋に同じ名前かつ同じアイコンの人がいるケース', async () => {
    // ユーザ0作成
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

    // user1入室
    await new Mongodb<void>()
      .transactionMethod(
        l_entering_room({
          userId: _userId1,
          roomId: _roomId,
          ip: '11.11.11.11'
        })
      )
      .catch(e => '');

    // 部屋の人数1になっているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(1);
  });
});

describe('l_entering_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case4 部屋の上限のため入室できないケース', async () => {
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
      l_create_room({ hostId: _userId0, upper: 2, name: 'room0' })
    );

    // user1作成
    const _userId1 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user1',
          ip: '11.11.11.11'
        });
      }
    );

    // user1入室
    await new Mongodb<void>().transactionMethod(
      l_entering_room({
        userId: _userId1,
        roomId: _roomId,
        ip: '11.11.11.11'
      })
    );

    // user2作成
    const _userId2 = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user2',
          ip: '22.22.22.22'
        });
      }
    );

    // user2入室
    await new Mongodb<void>()
      .transactionMethod(
        l_entering_room({
          userId: _userId2,
          roomId: _roomId,
          ip: '22.22.22.22'
        })
      )
      .catch(e => '');

    // 部屋の人数2になっているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(2);
  });
});
