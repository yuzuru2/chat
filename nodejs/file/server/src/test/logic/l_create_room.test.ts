import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';

describe('l_create_room', () => {
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

    // 部屋が作成されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.rooms.find({ roomId: _roomId })).length;
      })
    ).toEqual(1);

    // 入室できているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.users.aggregate_roominfo({
          roomId: _roomId
        })).length;
      })
    ).toEqual(1);
  });
});
