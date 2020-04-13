import * as mongodb from 'mongodb';

import { streamFind } from 'src/mongodb';

/**
 * interface
 */
interface i_talks {
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
}

export class Talks {
  private collection: mongodb.Collection<i_talks> = null;
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
    this.collection = db.collection<i_talks>('talks');
    this.option.session = session === undefined ? null : session;
  }

  /**
   * 投稿
   * @param params
   */
  async insert(
    params: Pick<
      i_talks,
      | 'roomId'
      | 'roomName'
      | 'userId'
      | 'userName'
      | 'iconId'
      | 'ip'
      | 'kind'
      | 'message'
    >
  ) {
    const _talkId = new mongodb.ObjectID().toHexString();
    const _p: i_talks = {
      talkId: _talkId,
      roomId: params.roomId,
      roomName: params.roomName,
      userId: params.userId,
      userName: params.userName,
      iconId: params.iconId,
      ip: params.ip,
      kind: params.kind,
      message: params.message,
      createdAt: new Date()
    };

    await this.collection.insertOne(_p, this.option);
    return _talkId;
  }

  /**
   * 削除するドキュメント数
   * @param time
   */
  async get_count_past(time: Date) {
    return await this.collection
      .find(
        {
          createdAt: {
            $lt: time
          }
        },
        this.option
      )
      .count();
  }

  /**
   * 1日1回画像を移動するときに使う
   */
  async find_upload_file(time: Date) {
    return await streamFind<i_talks>(
      await this.collection.find(
        {
          createdAt: {
            $lt: time
          },
          kind: 1
        },
        this.option
      )
    );
  }

  /**
   * 1日1回ログをjsonに変換するときに使う
   * @param num
   * @param limit
   * @param time
   */
  async find_past(num: number, limit: number, time: Date) {
    return await streamFind<i_talks>(
      await this.collection
        .find(
          {
            createdAt: {
              $lt: time
            }
          },
          this.option
        )
        .sort({ createdAt: 1 })
        .skip(num * limit)
        .limit(limit)
    );
  }

  /**
   * 古いログを消す
   * @param params
   */
  async delete_old(time: Date) {
    return (await this.collection.deleteMany(
      {
        createdAt: {
          $lt: time
        }
      },
      this.option
    )).deletedCount;
  }

  /**
   * 部屋トーク一覧
   * @param params
   */
  async aggregate_talk(params: {
    roomId: string;
  }): Promise<
    {
      talkId: string;
      userId: string;
      userName: string;
      iconId: number;
      message: string;
      kind: number;
      kidokus: string[];
      createdAt: Date;
    }[]
  > {
    return new Promise(async resolve => {
      const _cursor = await this.collection
        .aggregate([
          {
            $match: params
          },
          {
            $sort: { createdAt: -1 }
          },
          {
            $lookup: {
              from: 'kidokus',
              localField: 'talkId',
              foreignField: 'talkId',
              as: 'k'
            }
          },
          {
            $project: {
              talkId: '$talkId',
              userId: '$userId',
              userName: '$userName',
              iconId: '$iconId',
              message: '$message',
              kind: '$kind',
              kidokus: '$k.userId',
              createdAt: '$createdAt'
            }
          }
        ])
        .limit(30);

      let _ret: {
        talkId: string;
        userId: string;
        userName: string;
        iconId: number;
        message: string;
        kind: number;
        kidokus: string[];
        createdAt: Date;
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
