import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_every } from 'src/logic/l_every';

// jwt
import { encode } from 'src/jwt';

// 定数
import { constant } from 'src/constant';

describe('l_every', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('初回アクセス', async () => {
    expect(
      await new Mongodb<{ userId: string; roomId: string }>().normalMethod(
        l_every({ jwt_token: '', ip: '1.1.1.1' })
      )
    ).toEqual(null);
  });
});

describe('l_every', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('ユーザ作成されている時', async () => {
    // ユーザ作成
    const _userId = await new Mongodb<string>().normalMethod(
      async (argument: t_argument) => {
        return await argument.model.users.insert({
          iconId: 0,
          name: 'user0',
          ip: '1.1.1.1'
        });
      }
    );

    expect(
      await new Mongodb<{ userId: string; roomId: string }>().normalMethod(
        l_every({
          jwt_token: encode<{ userId: string }>(
            { userId: _userId },
            constant.PRIVATE_KEY
          ),
          ip: '1.1.1.1'
        })
      )
    ).toEqual({
      userId: _userId,
      roomId: null
    });
  });
});

describe('l_every', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('ブラックリストが来た時', async () => {
    // テストデータ挿入
    await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
      await argument.model.bls.insert('1.1.1.1');
    });

    expect(
      await new Mongodb<{ userId: string; roomId: string }>().normalMethod(
        l_every({ jwt_token: '', ip: '1.1.1.1' })
      )
    ).toEqual(undefined);
  });
});

describe('l_every', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('改ざんしたトークンが送られてきたとき', async () => {
    expect(
      await new Mongodb<{ userId: string; roomId: string }>().normalMethod(
        l_every({ jwt_token: 'kaizan_token', ip: '1.1.1.1' })
      )
    ).toEqual(undefined);

    // ブラックリスト入りされているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.bls.find('1.1.1.1')).length;
      })
    ).toEqual(1);
  });
});
