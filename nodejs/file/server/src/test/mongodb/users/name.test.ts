import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('users', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('nameバリデーションチェック', async () => {
    // ''
    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          name: '',
          iconId: 0,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // ' '
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          name: ' ',
          iconId: 0,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 16文字
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          name: 'aaaaaaaaaaaaaaaa',
          iconId: 0,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 15文字
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          name: 'aaaaaaaaaaaaaaa',
          iconId: 0,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);

    // 1文字
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.users.insert({
          name: 'a',
          iconId: 0,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);
  });
});
