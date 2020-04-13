import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

describe('rooms', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    done();
  });

  test('insert find updateName updateUpper updateHostId delete', async () => {
    let _roomId: string;

    // insert find
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        _roomId = await argument.model.rooms.insert({
          name: 'roomname',
          upper: 5,
          hostId: 'a'
        });
        return (await argument.model.rooms.find({ roomId: _roomId })).length;
      })
    ).toEqual(1);

    // updateName
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.updateName(
          { roomId: _roomId },
          { name: 'change' }
        );
      })
    ).toEqual(1);

    // updateUpper
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.updateUpper(
          { roomId: _roomId },
          { upper: 6 }
        );
      })
    ).toEqual(1);

    // updateHostId
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.updateHostId(
          { roomId: _roomId },
          { hostId: 'b' }
        );
      })
    ).toEqual(1);

    // delete
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return await argument.model.rooms.delete({ roomId: _roomId });
      })
    ).toEqual(1);
  });
});
