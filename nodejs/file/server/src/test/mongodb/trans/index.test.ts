import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('trans', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert delete', async () => {
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.trans.insert({ id: 'a' });
      })
    ).toEqual(1);

    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.trans.delete({ id: 'a' });
      })
    ).toEqual(1);
  });
});
