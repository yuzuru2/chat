import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

interface i_users {
  userId: string;
  iconId: number;
  name: string;
  roomId: string;
  ip: string;
  updatedAt: Date;
  createdAt: Date;
}

/**
 * usersクラス
 */
export class Users {
  private collection: mongodb.Collection<i_users> = null;
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
    this.collection = db.collection<i_users>('users');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * ip更新
   * @param where
   * @param set
   */
  async updateIp(where: Pick<i_users, 'userId'>, set: Pick<i_users, 'ip'>) {
    return (await this.collection.updateOne(
      where,
      { $set: { ...set, ...{ updatedAt: new Date() } } },
      this.option
    )).result.nModified;
  }

  /**
   * roomId更新
   * @param where
   * @param set
   */
  async updateRoomId(
    where: Pick<i_users, 'userId'>,
    set: Pick<i_users, 'roomId'>
  ) {
    return (await this.collection.updateOne(
      where,
      { $set: { ...set, ...{ updatedAt: new Date() } } },
      this.option
    )).result.nModified;
  }

  /**
   * ユーザ削除
   * ログアウト
   */
  async deleteUser(params: Pick<i_users, 'userId'>) {
    return (await this.collection.deleteOne(params, this.option)).deletedCount;
  }

  /**
   * ユーザ作成
   * ユーザIDを返す
   * @param params
   */
  async insert(params: Pick<i_users, 'iconId' | 'name' | 'ip'>) {
    const _ret = await this.collection.insertOne(
      {
        userId: new mongodb.ObjectID().toHexString(),
        iconId: params.iconId,
        name: params.name.trim(),
        roomId: null,
        ip: params.ip,
        updatedAt: new Date(),
        createdAt: new Date()
      },
      this.option
    );
    return _ret.ops[0].userId;
  }

  /**
   * ユーザをfind
   * @param params
   */
  async findUser(params: Pick<i_users, 'userId'>) {
    return await streamFind<i_users>(
      await this.collection.find(params, this.option)
    );
  }

  /**
   * 10分間ノーアクションのユーザ
   */
  async findExitUser() {
    return await streamFind<i_users>(
      await this.collection.find(
        {
          roomId: {
            $ne: null
          },
          updatedAt: {
            $lt: new Date(new Date().getTime() - 60 * 10 * 1000)
          }
        },
        this.option
      )
    );
  }

  /**
   * 部屋メンバのsocketidを返す
   * @param params
   */
  async aggregate_member_socket(params: {
    roomId: string;
  }): Promise<{ userId: string; socketId: string[] }[]> {
    return new Promise(async resolve => {
      const _cursor = await this.collection.aggregate([
        {
          $match: params
        },
        {
          $lookup: {
            from: 'cons',
            localField: 'userId',
            foreignField: 'userId',
            as: 'socket_Infos'
          }
        },
        {
          $project: {
            userId: '$userId',
            socketId: '$socket_Infos.socketId'
          }
        }
      ]);

      let _ret: { userId: string; socketId: string[] }[] = [];
      _cursor.on('data', doc => {
        _ret.push(doc);
      });

      _cursor.once('end', () => {
        resolve(_ret);
      });
    });
  }

  /**
   * 部屋情報
   * 引数なし: 全て
   * 引数あり: 特定の部屋
   * @param params
   */
  async aggregate_roominfo(params?: {
    roomId: string;
  }): Promise<
    {
      roomId: string;
      roomName: string;
      userId: string;
      userName: string;
      iconId: number;
      upper: number;
      hostId: string;
    }[]
  > {
    return new Promise(async resolve => {
      const _cursor = await this.collection.aggregate([
        {
          $match: {
            roomId: params === undefined ? { $ne: null } : params.roomId
          }
        },
        {
          $lookup: {
            from: 'rooms',
            localField: 'roomId',
            foreignField: 'roomId',
            as: 'room_Infos'
          }
        },
        { $unwind: '$room_Infos' },
        {
          $sort: { roomId: -1 }
        },
        {
          $project: {
            roomId: '$roomId',
            roomName: '$room_Infos.name',
            userId: '$userId',
            userName: '$name',
            iconId: '$iconId',
            upper: '$room_Infos.upper',
            hostId: '$room_Infos.hostId'
          }
        }
      ]);

      let _ret: {
        roomId: string;
        roomName: string;
        userId: string;
        userName: string;
        iconId: number;
        upper: number;
        hostId: string;
      }[] = [];
      _cursor.on('data', doc => {
        _ret.push(doc);
      });

      _cursor.once('end', () => {
        resolve(_ret);
      });
    });
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
