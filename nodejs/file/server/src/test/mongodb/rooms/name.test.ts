import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('rooms', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('nameバリデーションチェック', async () => {
    // ''
    let _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: '',
          upper: 5,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // ''
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: ' ',
          upper: 5,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 'aaaaaaaaaaaaaaaaaaaaa' 21文字
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'aaaaaaaaaaaaaaaaaaaaa',
          upper: 5,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 'a' 1文字
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'a',
          upper: 5,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);

    // 'aaaaaaaaaaaaaaaaaaaa' 20文字
    _ret = true;
    await new Mongodb<string>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.insert({
          name: 'aaaaaaaaaaaaaaaaaaaa',
          upper: 5,
          hostId: 'a'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);
  });
});
