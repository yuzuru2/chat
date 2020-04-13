import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

/**
 * interface
 */
interface i_rooms {
  roomId: string;
  name: string;
  upper: number;
  hostId: string;
  createdAt: Date;
}

export class Rooms {
  private collection: mongodb.Collection<i_rooms> = null;
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
    this.collection = db.collection<i_rooms>('rooms');
    this.option.session = session === undefined ? null : session;
  }

  async find(params: { roomId: string }) {
    return await streamFind<i_rooms>(
      await this.collection.find(params, this.option)
    );
  }

  /**
   * 部屋作成
   * @param params
   */
  async insert(params: Pick<i_rooms, 'name' | 'upper' | 'hostId'>) {
    const _insert_roomId = new mongodb.ObjectID().toHexString();
    await this.collection.insertOne(
      {
        roomId: _insert_roomId,
        name: params.name.trim(),
        upper: params.upper,
        hostId: params.hostId,
        createdAt: new Date()
      },
      this.option
    );
    return _insert_roomId;
  }

  /**
   * 部屋名変更
   * @param where
   * @param set
   */
  async updateName(where: Pick<i_rooms, 'roomId'>, set: Pick<i_rooms, 'name'>) {
    return (await this.collection.updateOne(where, { $set: set }, this.option))
      .result.nModified;
  }

  /**
   * 部屋上限変更
   * @param where
   * @param set
   */
  async updateUpper(
    where: Pick<i_rooms, 'roomId'>,
    set: Pick<i_rooms, 'upper'>
  ) {
    return (await this.collection.updateOne(where, { $set: set }, this.option))
      .result.nModified;
  }

  /**
   * 部屋ホスト変更
   * @param where
   * @param set
   */
  async updateHostId(
    where: Pick<i_rooms, 'roomId'>,
    set: Pick<i_rooms, 'hostId'>
  ) {
    return (await this.collection.updateOne(where, { $set: set }, this.option))
      .result.nModified;
  }

  /**
   * 部屋削除
   * @param params
   */
  async delete(params: Pick<i_rooms, 'roomId'>) {
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
