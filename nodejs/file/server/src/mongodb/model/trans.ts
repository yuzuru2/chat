import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

/**
 * interface
 */
interface i_trans {
  id: string;
}

export class Trans {
  private collection: mongodb.Collection<i_trans> = null;
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
    this.collection = db.collection<i_trans>('trans');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * 行ロック的なメソッド
   * @param params
   */
  async insert(params: Pick<i_trans, 'id'>) {
    const _ret = await this.collection.insertOne(
      {
        id: params.id
      },
      this.option
    );

    return _ret.result.n;
  }

  /**
   * 行ロック解除的なメソッド
   * @param params
   */
  async delete(params: Pick<i_trans, 'id'>) {
    return (await this.collection.deleteOne(params, this.option)).deletedCount;
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
