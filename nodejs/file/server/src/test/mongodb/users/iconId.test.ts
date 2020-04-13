import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('users', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('iconIdバリデーションチェック', async () => {
    // -1
    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          iconId: -1,
          name: 'aa',
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 26
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          iconId: 26,
          name: 'aa',
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 少数1.2
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          iconId: 1.2,
          name: 'aa',
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 0
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          iconId: 0,
          name: 'aa',
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);

    // 25
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          iconId: 25,
          name: 'aa',
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);
  });
});
