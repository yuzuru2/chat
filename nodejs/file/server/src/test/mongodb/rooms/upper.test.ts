import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('rooms', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('upperバリデーションチェック', async () => {
    // 1
    let _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 1,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 16
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 16,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 浮動少数
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 1.2,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 2
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 2,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);

    // 15
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 15,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);
  });
});
