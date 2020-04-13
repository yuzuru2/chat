import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('talks', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert aggregate_talk get_count_past find_upload_file find_past delete_old', async () => {
    let _talkId: string;

    // insert aggregate_talk
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        _talkId = await argument.model.talks.insert({
          roomId: 'a',
          roomName: 'roomname',
          userId: 'b',
          userName: 'username',
          iconId: 1,
          ip: '1.1.1.1',
          kind: 1,
          message: 'a.jpg'
        });

        return (await argument.model.talks.aggregate_talk({ roomId: 'a' }))
          .length;
      })
    ).toEqual(1);

    // aggregate_talk 既読あり時
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        await argument.model.kidokus.insert([
          { talkId: _talkId, userId: 'c', roomId: 'a' }
        ]);
        return (await argument.model.talks.aggregate_talk({ roomId: 'a' }))[0]
          .kidokus.length;
      })
    ).toEqual(1);

    // get_count_past
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.talks.get_count_past(
          new Date(new Date().getTime() - 1)
        );
      })
    ).toEqual(1);

    // find_upload_file
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.find_upload_file(
          new Date(new Date().getTime() - 1)
        )).length;
      })
    ).toEqual(1);

    // find_past
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.find_past(
          0,
          100,
          new Date(new Date().getTime() - 1)
        )).length;
      })
    ).toEqual(1);

    // delete_old
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return argument.model.talks.delete_old(
          new Date(new Date().getTime() - 1)
        );
      })
    ).toEqual(1);
  });
});
