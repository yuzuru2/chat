import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('bls', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert find', async () => {
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        await argument.model.bls.insert('1.1.1.1');
        return (await argument.model.bls.find('1.1.1.1')).length;
      })
    ).toEqual(1);
  });
});
