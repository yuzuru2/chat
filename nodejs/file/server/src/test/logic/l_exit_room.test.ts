import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_exit_room } from 'src/logic/l_exit_room';
import { l_entering_room } from 'src/logic/l_entering_room';

describe('l_exit_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case1 部屋人数1人', async () => {
    // ユーザ作成
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

    // 退室
    await new Mongodb<void>().transactionMethod(
      l_exit_room({ userId: _userId, roomId: _roomId, ip: '1.1.1.1' })
    );

    // 部屋が消滅されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.rooms.find({ roomId: _roomId })).length;
      })
    ).toEqual(0);

    // 退室メッセージが挿入されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(1);
  });
});

describe('l_exit_room', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('case2 部屋人数2人', async () => {
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

    // user0退室
    await new Mongodb<void>().transactionMethod(
      l_exit_room({ userId: _userId0, roomId: _roomId, ip: '1.1.1.1' })
    );

    // 権限が委譲されているか
    expect(
      await new Mongodb<boolean>().normalMethod(
        async (argument: t_argument) => {
          const _roominfo = await argument.model.users.aggregate_roominfo({
            roomId: _roomId
          });
          if (_roominfo[0].hostId === _userId1) {
            return true;
          }
          return false;
        }
      )
    ).toEqual(true);

    // 入室メッセージ 退室メッセージ 権限移譲メッセージ 合計3件
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(3);

    // user1退室
    await new Mongodb<void>().transactionMethod(
      l_exit_room({ userId: _userId1, roomId: _roomId, ip: '1.1.1.1' })
    );

    // 部屋が消滅されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.rooms.find({ roomId: _roomId })).length;
      })
    ).toEqual(0);

    // 入室メッセージ 退室メッセージ 権限移譲メッセージ 退室メッセージ 合計4件
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(4);
  });
});
