// npm i --save mongodb @types/mongodb saslprep moment @types/moment
process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import * as mongodb from 'mongodb';
import * as fs from 'fs';
require('saslprep');

/**
 * model
 */
import { Bls } from 'src/mongodb/model/bls';
import { Cons } from 'src/mongodb/model/cons';
import { Kidokus } from 'src/mongodb/model/kidokus';
import { RoomBls } from 'src/mongodb/model/room_bls';
import { Rooms } from 'src/mongodb/model/rooms';
import { Talks } from 'src/mongodb/model/talks';
import { Trans } from 'src/mongodb/model/trans';
import { Users } from 'src/mongodb/model/users';

import { Initialization } from 'src/mongodb/Initialization';

/**
 * ビジネスロジック関数の引数の型
 */
export type t_argument = {
  model: {
    bls: Bls;
    cons: Cons;
    kidokus: Kidokus;
    room_bls: RoomBls;
    rooms: Rooms;
    talks: Talks;
    trans: Trans;
    users: Users;
  };
};

export class Mongodb<T> {
  private client: mongodb.MongoClient = null;
  private db: mongodb.Db = null;
  private static init_flag = false;

  /**
   * model
   */
  private model: t_argument['model'] = {
    bls: null,
    cons: null,
    kidokus: null,
    room_bls: null,
    rooms: null,
    talks: null,
    trans: null,
    users: null
  };

  /**
   * コンストラクタ
   */
  constructor() {}

  /**
   * 接続
   */
  private async connect() {
    // 設定ファイル読み込み
    const dbconf = JSON.parse(
      fs.readFileSync(`${process.cwd()}/config/database.json`, 'utf-8')
    )['mongodb'][process.env.NODE_ENV];

    // 接続
    this.client = await mongodb.MongoClient.connect(dbconf, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    this.db = await this.client.db();

    if (Mongodb.init_flag === false) {
      await Initialization(this.db);
      Mongodb.init_flag = true;
    }
  }

  /**
   * トランザクション
   */
  async transactionMethod(
    func: (params: t_argument) => Promise<T>
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let session: mongodb.ClientSession = null;
      try {
        await this.connect();
        session = this.client.startSession();

        // トランザクション開始
        session.startTransaction();

        // model初期化
        this.model.bls = new Bls(this.db, session);
        this.model.cons = new Cons(this.db, session);
        this.model.kidokus = new Kidokus(this.db, session);
        this.model.room_bls = new RoomBls(this.db, session);
        this.model.rooms = new Rooms(this.db, session);
        this.model.talks = new Talks(this.db, session);
        this.model.trans = new Trans(this.db, session);
        this.model.users = new Users(this.db, session);

        // ビジネスロジック実行
        resolve(await func({ model: this.model }));

        // コミット
        await session.commitTransaction();
      } catch (e) {
        // ロールバック
        await session.abortTransaction();
        reject(e);
      } finally {
        session.endSession();
        this.client.close();
      }
    });
  }

  /**
   * トランザクションなし
   */
  async normalMethod(func: (params: t_argument) => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.connect();

        // model初期化
        this.model.bls = new Bls(this.db);
        this.model.cons = new Cons(this.db);
        this.model.kidokus = new Kidokus(this.db);
        this.model.room_bls = new RoomBls(this.db);
        this.model.rooms = new Rooms(this.db);
        this.model.talks = new Talks(this.db);
        this.model.trans = new Trans(this.db);
        this.model.users = new Users(this.db);

        const _ret = await func({ model: this.model });
        this.client.close();

        resolve(_ret);
      } catch (e) {
        reject(e);
      }
    });
  }
}

/**
 * ストリームを使う
 * @param collection
 * @param params
 */
export const streamFind = <U>(cursor: mongodb.Cursor<any>): Promise<U[]> => {
  return new Promise(async resolve => {
    const _stream = await cursor.stream();

    let _ret: U[] = [];
    _stream.on('data', _item => {
      _ret.push(_item);
    });
    _stream.on('end', () => {
      resolve(_ret);
    });
  });
};
