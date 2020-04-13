import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('room_bls', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert find delete', async () => {
    // find(ipのみ一致する時)
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        await argument.model.room_bls.insert({
          roomId: 'a',
          userId: 'b',
          ip: '1.1.1.1'
        });
        return (await argument.model.room_bls.find({
          roomId: 'a',
          userId: 'bbbbbb',
          ip: '1.1.1.1'
        })).length;
      })
    ).toEqual(1);

    // find(userIdのみ一致する時)
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.room_bls.find({
          roomId: 'a',
          userId: 'b',
          ip: '11.11.11.11'
        })).length;
      })
    ).toEqual(1);

    // delete
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.room_bls.delete({
          roomId: 'a'
        });
      })
    ).toEqual(1);
  });
});
