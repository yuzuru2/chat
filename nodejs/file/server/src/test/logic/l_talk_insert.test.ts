import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_talk_insert } from 'src/logic/l_talk_insert';

describe('l_talk_insert', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('', async () => {
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

    // 投稿
    await new Mongodb<void>().normalMethod(
      l_talk_insert({
        userId: _userId,
        roomId: _roomId,
        ip: '1.1.1.1',
        message: 'サイコロ'
      })
    );

    // サイコロ サイコロの結果 合計2件投稿されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(2);

    // 投稿
    await new Mongodb<void>().normalMethod(
      l_talk_insert({
        userId: _userId,
        roomId: _roomId,
        ip: '1.1.1.1',
        message: 'おみくじ'
      })
    );

    // サイコロ サイコロの結果 おみくじ おみくじの結果 合計4件投稿されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(4);
  });
});
