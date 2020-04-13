import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('kidokus', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert', async () => {
    expect(
      await new Mongodb<boolean>().normalMethod(
        async (argument: t_argument) => {
          return await argument.model.kidokus.insert([
            {
              talkId: 'a',
              userId: 'b',
              roomId: 'c'
            }
          ]);
        }
      )
    ).toEqual(true);

    // 重複データ挿入でfalse
    expect(
      await new Mongodb<boolean>().normalMethod(
        async (argument: t_argument) => {
          return await argument.model.kidokus.insert([
            {
              talkId: 'a',
              userId: 'b',
              roomId: 'c'
            }
          ]);
        }
      )
    ).toEqual(false);

    // delete
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.kidokus.delete({
          roomId: 'c'
        });
      })
    ).toEqual(1);
  });
});
