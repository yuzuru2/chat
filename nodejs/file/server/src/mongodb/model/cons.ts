import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

/**
 * interface
 */
interface i_cons {
  socketId: string;
  userId: string;
  ip: string;
}

export class Cons {
  private collection: mongodb.Collection<i_cons> = null;
  private option: {
    session: mongodb.ClientSession;
  } = {
    session: null
  };

  /**
   * constructor
   * @param db
   * @param session
   */
  constructor(db: mongodb.Db, session?: mongodb.ClientSession) {
    this.collection = db.collection<i_cons>('cons');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * コネクション作成
   * @param params
   */
  async insert(params: i_cons) {
    return (await this.collection.insertOne(params, this.option)).result.n;
  }

  /**
   * 重複IPでないか調べる
   * @param params
   */
  async findIp(params: Pick<i_cons, 'ip'>) {
    return await streamFind<i_cons>(
      await this.collection.find(params, this.option)
    );
  }

  /**
   * コネクションfind
   * @param params
   */
  async findsocketId(params?: Pick<i_cons, 'socketId'>) {
    return await streamFind<i_cons>(
      await this.collection.find(params, this.option)
    );
  }

  /**
   * コネクション削除
   * @param params
   */
  async delete(params?: Pick<i_cons, 'socketId'>) {
    return (await this.collection.deleteMany(params, this.option)).deletedCount;
  }

  /**
   * テスト用
   */
  async deleteAll() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('テストの時だけ使ってください');
    }
    return (await this.collection.deleteMany({}, this.option)).deletedCount;
  }
}
