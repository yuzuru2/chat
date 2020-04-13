import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_after_second } from 'src/logic/l_after_second';

// jwt
import { encode } from 'src/jwt';

// 定数
import { constant } from 'src/constant';

describe('l_after_second', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('root', async () => {
    expect(
      (await l_after_second({ jwt_token: '', ip: '1.1.1.1' })).url
    ).toEqual(constant.URL_ROOT);
  });
});

describe('l_after_second', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('lounge', async () => {
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
      (await l_after_second({
        jwt_token: encode<{ userId: string }>(
          { userId: _userId },
          constant.PRIVATE_KEY
        ),
        ip: '1.1.1.1'
      })).url
    ).toEqual(constant.URL_LOUNGE);
  });
});

describe('l_after_second', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('room', async () => {
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

    // 部屋作成
    await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId, upper: 5, name: 'room0' })
    );

    expect(
      (await l_after_second({
        jwt_token: encode<{ userId: string }>(
          { userId: _userId },
          constant.PRIVATE_KEY
        ),
        ip: '1.1.1.1'
      })).url
    ).toEqual(constant.URL_ROOM);
  });
});

describe('l_after_second', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('ブラックリストが来た時', async () => {
    let _ret = true;
    await l_after_second({ jwt_token: 'kaizan_token', ip: '1.1.1.1' }).catch(
      e => (_ret = false)
    );
    expect(_ret).toEqual(false);
  });
});
