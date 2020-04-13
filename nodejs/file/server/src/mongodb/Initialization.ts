import * as mongodb from 'mongodb';

export const Initialization = async (db: mongodb.Db) => {
  await trans(db);
  await talks(db);
  await rooms(db);
  await room_bls(db);
  await kidokus(db);
  await cons(db);
  await bls(db);
  await users(db);
};

const trans = async (db: mongodb.Db) => {
  const collection = 'trans';
  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['id'],
        properties: {
          id: {
            bsonType: 'string'
          }
        }
      }
    }
  });

  await db.collection(collection).createIndex({ id: 1 }, { unique: true });
};

const talks = async (db: mongodb.Db) => {
  const collection = 'talks';
  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'talkId',
          'roomId',
          'roomName',
          'userId',
          'userName',
          'iconId',
          'ip',
          'kind',
          'message',
          'createdAt'
        ],
        properties: {
          talkId: {
            bsonType: 'string'
          },
          roomId: {
            bsonType: 'string'
          },
          roomName: {
            bsonType: 'string'
          },
          userId: {
            bsonType: ['string', 'null']
          },
          userName: {
            bsonType: 'string'
          },
          iconId: {
            bsonType: 'int'
          },
          kind: {
            bsonType: 'int',
            minimum: 0,
            maximum: 1
          },
          message: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 150
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db.collection(collection).createIndex({ talkId: 1 }, { unique: true });
};

const rooms = async (db: mongodb.Db) => {
  const collection = 'rooms';
  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['roomId', 'name', 'upper', 'hostId', 'createdAt'],
        properties: {
          roomId: {
            bsonType: 'string'
          },
          name: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 20
          },
          upper: {
            bsonType: 'int',
            minimum: 2,
            maximum: 15
          },
          hostId: {
            bsonType: 'string'
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db.collection(collection).createIndex({ roomId: 1 }, { unique: true });
};

const room_bls = async (db: mongodb.Db) => {
  const collection = 'room_bls';

  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['roomId', 'userId', 'ip', 'createdAt'],
        properties: {
          roomId: {
            bsonType: 'string'
          },
          userId: {
            bsonType: 'string'
          },
          ip: {
            bsonType: 'string'
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db
    .collection(collection)
    .createIndex({ roomId: 1, userId: 1 }, { unique: true });
};

const kidokus = async (db: mongodb.Db) => {
  const collection = 'kidokus';

  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['talkId', 'roomId', 'userId', 'createdAt'],
        properties: {
          talkId: {
            bsonType: 'string'
          },
          roomId: {
            bsonType: 'string'
          },
          userId: {
            bsonType: 'string'
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db
    .collection(collection)
    .createIndex({ talkId: 1, userId: 1 }, { unique: true });
};

const bls = async (db: mongodb.Db) => {
  const collection = 'bls';

  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['ip', 'createdAt'],
        properties: {
          ip: {
            bsonType: 'string'
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db.collection(collection).createIndex({ ip: 1 }, { unique: true });
};

const cons = async (db: mongodb.Db) => {
  const collection = 'cons';
  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['socketId', 'userId', 'ip'],
        properties: {
          socketId: {
            bsonType: 'string'
          },
          userId: {
            bsonType: ['string', 'null']
          },
          ip: {
            bsonType: 'string'
          }
        }
      }
    }
  });

  await db
    .collection(collection)
    .createIndex({ socketId: 1 }, { unique: true });
};

const users = async (db: mongodb.Db) => {
  const collection = 'users';
  await db.createCollection(collection, {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: [
          'userId',
          'iconId',
          'name',
          'roomId',
          'ip',
          'updatedAt',
          'createdAt'
        ],
        properties: {
          userId: {
            bsonType: 'string'
          },
          iconId: {
            bsonType: 'int',
            minimum: 0,
            maximum: 25
          },
          name: {
            bsonType: 'string',
            minLength: 1,
            maxLength: 15
          },
          roomId: {
            bsonType: ['string', 'null']
          },
          ip: {
            bsonType: 'string'
          },
          updatedAt: {
            bsonType: 'date'
          },
          createdAt: {
            bsonType: 'date'
          }
        }
      }
    }
  });

  await db.collection(collection).createIndex({ userId: 1 }, { unique: true });
};
