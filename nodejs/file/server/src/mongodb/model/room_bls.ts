import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

/**
 * interface
 */
interface i_room_bls {
  roomId: string;
  userId: string;
  ip: string;
  createdAt: Date;
}

export class RoomBls {
  private collection: mongodb.Collection<i_room_bls> = null;
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
    this.collection = db.collection<i_room_bls>('room_bls');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * 部屋ブラックリスト入り
   * @param params
   */
  async insert(params: Pick<i_room_bls, 'roomId' | 'ip' | 'userId'>) {
    return (await this.collection.insertOne(
      {
        ...params,
        ...{ createdAt: new Date() }
      },
      this.option
    )).insertedCount;
  }

  /**
   * 部屋ブラックリストか確かめる
   * @param params
   */
  async find(params: Pick<i_room_bls, 'roomId' | 'ip' | 'userId'>) {
    return await streamFind<i_room_bls>(
      await this.collection.find(
        {
          $or: [{ userId: params.userId }, { ip: params.ip }],
          roomId: params.roomId
        },
        this.option
      )
    );
  }

  /**
   * 削除する
   * @param params
   */
  async delete(params: Pick<i_room_bls, 'roomId'>) {
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
