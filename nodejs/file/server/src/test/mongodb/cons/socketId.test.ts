import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('cons', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('socketId 重複', async () => {
    // テストデータ挿入
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.cons.insert({
        socketId: 'a',
        userId: null,
        ip: '1.1.1.1'
      });
    });

    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(async (argument: t_argument) => {
        await argument.model.cons.insert({
          socketId: 'a',
          userId: null,
          ip: '1.1.1.1'
        });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
