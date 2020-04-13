import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('trans', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('id重複', async () => {
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.trans.insert({ id: 'a' });
      })
    ).toEqual(1);

    let _ret = true;
    await new Mongodb<number>()
      .normalMethod(async (argument: t_argument) => {
        return await argument.model.trans.insert({ id: 'a' });
      })
      .catch(() => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
