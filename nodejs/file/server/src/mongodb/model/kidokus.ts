import * as mongodb from 'mongodb';

/**
 * interface
 */
interface i_kidokus {
  talkId: string;
  userId: string;
  roomId: string;
  createdAt: Date;
}

export class Kidokus {
  private collection: mongodb.Collection<i_kidokus> = null;
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
    this.collection = db.collection<i_kidokus>('kidokus');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * 削除
   * @param params
   */
  async delete(params: Pick<i_kidokus, 'roomId'>) {
    return (await this.collection.deleteMany(params, this.option)).deletedCount;
  }

  /**
   * 既読挿入
   * 返り値がtrue: 新しい既読が挿入された
   * @param params
   */
  async insert(params: Pick<i_kidokus, 'talkId' | 'roomId' | 'userId'>[]) {
    let _ret = true;

    const _p: i_kidokus[] = params.map(m => {
      return {
        talkId: m.talkId,
        roomId: m.roomId,
        userId: m.userId,
        createdAt: new Date()
      };
    });

    if (_p.length === 0) {
      return false;
    }

    await this.collection.insertMany(_p, { ordered: false }).catch(e => {
      e.result.result.nInserted === 0 ? (_ret = false) : '';
    });

    return _ret;
  }

  /**
   * テスト用
   */
  async deleteAll() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('テストの時だけ使ってください');
    }
    return (await this.collection.deleteMany({}, this.option)).result.n;
  }
}
