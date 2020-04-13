import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';
import { users_rock } from 'src/logic/parts';

describe('users_rock ', () => {
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

    expect(
      (await new Mongodb<any>().normalMethod(async (argument: t_argument) => {
        return await users_rock({ argument: argument, userId: _userId });
      })) != undefined
    ).toEqual(true);
  });
});

describe('users_rock ', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('エラー', async () => {
    let _ret = true;
    await new Mongodb<any>()
      .normalMethod(async (argument: t_argument) => {
        return await users_rock({ argument: argument, userId: 'error_id' });
      })
      .catch(e => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
