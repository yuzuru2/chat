import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';
import { room_rock } from 'src/logic/parts';

// logic
import { l_create_room } from 'src/logic/l_create_room';

describe('room_rock', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('通常', async () => {
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

    expect(
      (await new Mongodb<any>().normalMethod(async (argument: t_argument) => {
        return await room_rock({ argument: argument, roomId: _roomId });
      })) != undefined
    ).toEqual(true);
  });
});

describe('room_rock', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('エラー', async () => {
    let _ret = true;
    await new Mongodb<any>()
      .normalMethod(async (argument: t_argument) => {
        return await room_rock({ argument: argument, roomId: 'error_id' });
      })
      .catch(e => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
