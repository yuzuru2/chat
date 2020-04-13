import * as fs from 'fs';

import { Mongodb, t_argument } from 'src/mongodb';
import { all_delete } from 'src/test/util';

// logic
import { l_create_room } from 'src/logic/l_create_room';
import { l_upload } from 'src/logic/l_upload';

/**
 * 定数
 */
import { constant } from 'src/constant';

describe('l_upload', () => {
  afterEach(async done => {
    // 削除
    await all_delete();

    // ファイル削除
    const files = fs.readdirSync(
      constant.PATH_UPLOAD_FILE[process.env.NODE_ENV]
    );

    let _count = 0;

    for (const file of files) {
      if (file === 'tmp') {
        continue;
      }

      fs.unlinkSync(
        `${constant.PATH_UPLOAD_FILE[process.env.NODE_ENV]}/${file}`
      );

      _count++;
    }

    expect(_count).toEqual(3);

    done();
  });

  test('jpg gif png', async () => {
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
    const _roomId = await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId, upper: 5, name: 'room0' })
    );

    /**
     * 画像ファイル読み込み
     */
    const jpg = fs.readFileSync(`${process.cwd()}/src/test/binary/jpg.jpg`);
    const png = fs.readFileSync(`${process.cwd()}/src/test/binary/png.png`);
    const gif = fs.readFileSync(`${process.cwd()}/src/test/binary/gif.gif`);

    // jpg
    await new Mongodb<void>().normalMethod(
      l_upload({
        userId: _userId,
        roomId: _roomId,
        ip: '1.1.1.1',
        upload_file: jpg
      })
    );

    // png
    await new Mongodb<void>().normalMethod(
      l_upload({
        userId: _userId,
        roomId: _roomId,
        ip: '1.1.1.1',
        upload_file: png
      })
    );

    // gif
    await new Mongodb<void>().normalMethod(
      l_upload({
        userId: _userId,
        roomId: _roomId,
        ip: '1.1.1.1',
        upload_file: gif
      })
    );

    // 3件投稿されているか
    expect(
      await new Mongodb<number>().normalMethod(async (argument: t_argument) => {
        return (await argument.model.talks.aggregate_talk({ roomId: _roomId }))
          .length;
      })
    ).toEqual(3);
  });
});

describe('l_upload', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('テキストファイルでエラー', async () => {
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
    const _roomId = await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId, upper: 5, name: 'room0' })
    );

    /**
     * テキストファイル読み込み
     */
    const txt = fs.readFileSync(`${process.cwd()}/src/test/binary/txt.txt`);

    let _ret = true;
    await new Mongodb<void>()
      .normalMethod(
        l_upload({
          userId: _userId,
          roomId: _roomId,
          ip: '1.1.1.1',
          upload_file: txt
        })
      )
      .catch(e => (_ret = false));

    expect(_ret).toEqual(false);
  });
});

describe('l_upload', () => {
  afterEach(async done => {
    // 削除
    await all_delete();
    done();
  });

  test('1MB以上のファイルアップロードでエラー', async () => {
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
    const _roomId = await new Mongodb<string>().normalMethod(
      l_create_room({ hostId: _userId, upper: 5, name: 'room0' })
    );

    /**
     * 画像ファイル読み込み
     */
    const gif = fs.readFileSync(`${process.cwd()}/src/test/binary/2mb.gif`);

    let _ret = true;
    // gif
    await new Mongodb<void>()
      .normalMethod(
        l_upload({
          userId: _userId,
          roomId: _roomId,
          ip: '1.1.1.1',
          upload_file: gif
        })
      )
      .catch(e => (_ret = false));
    expect(_ret).toEqual(false);
  });
});
