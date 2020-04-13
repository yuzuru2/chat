import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('talks', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('messageバリデーションチェック', async () => {
    let _ret = true;
    // ''
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.talks.insert({
          roomId: 'a',
          roomName: 'roomname',
          userId: 'b',
          userName: 'username',
          iconId: 1,
          ip: '1.1.1.1',
          kind: 0,
          message: ''
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 151文字
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.talks.insert({
          roomId: 'a',
          roomName: 'roomname',
          userId: 'b',
          userName: 'username',
          iconId: 1,
          ip: '1.1.1.1',
          kind: 0,
          message:
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);

    // 150文字
    _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.talks.insert({
          roomId: 'a',
          roomName: 'roomname',
          userId: 'b',
          userName: 'username',
          iconId: 1,
          ip: '1.1.1.1',
          kind: 0,
          message:
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(true);
  });
});
