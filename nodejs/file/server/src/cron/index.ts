// npm i --save node-cron @types/node-cron fs-extra @types/fs-extra

process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * コアモジュール
 */
import * as cron from 'node-cron';
import * as socketio from 'socket.io';
import * as redis from 'socket.io-redis';
import * as http from 'http';
import * as fs_extra from 'fs-extra';
import * as fs from 'fs';
import * as moment from 'moment';

/**
 * logic
 */
import { l_exit_room } from 'src/logic/l_exit_room';

/**
 * db
 */
import { Mongodb, t_argument } from 'src/mongodb';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * httpサーバ起動
 */
const io = socketio(http.createServer());

/**
 * socket.io-redis設定
 */
io.adapter(
  redis(
    JSON.parse(
      fs.readFileSync(`${process.cwd()}/config/database.json`, 'utf-8')
    )['redis'][process.env.NODE_ENV]
  )
);

/**
 * ファイル移動
 */
const move_file = (file_name: string) => {
  return new Promise(resolve => {
    fs_extra.move(
      `${constant.PATH_UPLOAD_FILE[process.env.NODE_ENV]}${file_name}`,

      `${process.cwd()}/past/file/${file_name}`,

      err => {
        resolve();
      }
    );
  });
};

/**
 * ファイル書き込み
 * @param data
 * @param num
 */
const write_file = (data: string, num: number) => {
  return new Promise(resolve => {
    fs.writeFile(
      `${process.cwd()}/past/log/${moment(new Date()).format(
        'YYYYMMDD'
      )}_${num}.json`,

      data,

      err => {
        resolve();
      }
    );
  });
};

/**
 * json形式で保存
 */
const save_log = async (time: Date) => {
  const limit = 500;
  const delete_number = await new Mongodb<number>().normalMethod(
    async (argument: t_argument) => {
      return await argument.model.talks.get_count_past(time);
    }
  );

  let num = 0;

  for (let i = 0; i < delete_number; i += limit) {
    const _ret = await new Mongodb<
      {
        talkId: string;
        roomId: string;
        roomName: string;
        userId: string;
        userName: string;
        iconId: number;
        ip: string;
        kind: number;
        message: string;
        createdAt: Date;
      }[]
    >().normalMethod(async (argument: t_argument) => {
      return await argument.model.talks.find_past(num, limit, time);
    });

    if (_ret.length !== 0) {
      // 書き込み
      await write_file(JSON.stringify(_ret), num);
    }

    if (_ret.length < limit) {
      break;
    }

    num++;
  }
};

/**
 * cron
 * 午前5時2分に実行
 *
 * 画像を移動
 * ログをjson形式で保存
 * ドキュメント削除
 */
cron.schedule('2 5 * * *', async () => {
  // 1日前の時間
  const _one_day_ago = new Date(new Date().getTime() - 60 * 60 * 1000); //new Date().getTime() - 60 * 60 * 24 * 1000

  const _upload_list = await new Mongodb<
    {
      talkId: string;
      roomId: string;
      roomName: string;
      userId: string;
      userName: string;
      iconId: number;
      ip: string;
      kind: number;
      message: string;
      createdAt: Date;
    }[]
  >().normalMethod(async (argument: t_argument) => {
    return argument.model.talks.find_upload_file(_one_day_ago);
  });
  for (let m of _upload_list) {
    try {
      await move_file(m.message);
    } catch (e) {}
  }

  // json形式でログを保存
  await save_log(_one_day_ago);

  // 古いログを消す
  await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
    await argument.model.talks.delete_old(_one_day_ago);
  });
});

/**
 * cron
 * 5分ごとに実行
 * 自動退室
 */
cron.schedule('*/5 * * * *', async () => {
  // 対象リスト
  const _list = await new Mongodb<
    {
      userId: string;
      iconId: number;
      name: string;
      roomId: string;
      ip: string;
      updatedAt: Date;
      createdAt: Date;
    }[]
  >().normalMethod(async (argument: t_argument) => {
    return await argument.model.users.findExitUser();
  });

  for (let m of _list) {
    try {
      // メンバのsocketid
      const _sockets = await new Mongodb<
        {
          userId: string;
          socketId: string[];
        }[]
      >().normalMethod(async (argument: t_argument) => {
        return await argument.model.users.aggregate_member_socket({
          roomId: m.roomId
        });
      });

      // 退室
      await new Mongodb<void>().normalMethod(
        l_exit_room({
          userId: m.userId,
          roomId: m.roomId,
          ip: m.ip
        })
      );

      // ブロードキャスト
      _sockets.map(m => {
        if (m.socketId.length !== 0) {
          io.to(m.socketId[0]).emit(constant.URL_OBSERVER_ROOM, {});
        }
      });
    } catch (e) {}
  }
});
