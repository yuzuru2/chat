import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_first } from 'src/logic/l_first';

describe('l_first', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('通常', async () => {
    expect(
      await new Mongodb<boolean>().normalMethod(
        l_first({ socket_list: [], ip: '1.1.1.1' })
      )
    ).toEqual(true);
  });
});

describe('l_first', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('同一IP接続時', async () => {
    // テストデータ挿入
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.cons.insert({
        socketId: 'test',
        userId: null,
        ip: '1.1.1.1'
      });
    });

    expect(
      await new Mongodb<boolean>().normalMethod(
        l_first({ socket_list: ['test'], ip: '1.1.1.1' })
      )
    ).toEqual(false);
  });
});

describe('l_first', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('データベースにごみが残っている時', async () => {
    // テストデータ挿入
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.cons.insert({
        socketId: 'test',
        userId: null,
        ip: '1.1.1.1'
      });
    });

    expect(
      await new Mongodb<boolean>().normalMethod(
        l_first({ socket_list: [], ip: '1.1.1.1' })
      )
    ).toEqual(true);
  });
});
