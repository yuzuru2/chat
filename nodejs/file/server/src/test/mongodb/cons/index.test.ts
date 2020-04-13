import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('cons', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert findIp findsocketId delete', async () => {
    // insert findIp
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        await argument.model.cons.insert({
          socketId: 'a',
          userId: null,
          ip: '1.1.1.1'
        });
        return (await argument.model.cons.findIp({ ip: '1.1.1.1' })).length;
      })
    ).toEqual(1);

    // findsocketId
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.cons.findsocketId({ socketId: 'a' }))
          .length;
      })
    ).toEqual(1);

    // delete
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        await argument.model.cons.delete({ socketId: 'a' });
        return (await argument.model.cons.findsocketId({ socketId: 'a' }))
          .length;
      })
    ).toEqual(0);
  });
});
