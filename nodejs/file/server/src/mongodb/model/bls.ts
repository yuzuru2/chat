import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

interface i_bls {
  ip: string;
  createdAt: Date;
}

export class Bls {
  private collection: mongodb.Collection<i_bls> = null;
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
    this.collection = db.collection<i_bls>('bls');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * ブラックリスト入り
   * @param ip
   */
  async insert(ip: string) {
    return (await this.collection.insertOne(
      { ip: ip, createdAt: new Date() },
      this.option
    )).insertedCount;
  }

  /**
   * ブラックリストか確かめる
   * @param ip
   */
  async find(ip: string) {
    return await streamFind<i_bls>(
      await this.collection.find({ ip: ip }, this.option)
    );
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
