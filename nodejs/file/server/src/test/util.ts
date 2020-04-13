import { Mongodb, t_argument } from 'src/mongodb';

export const all_delete = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('テストの時だけ使ってください');
  }
  
  await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
    await argument.model.users.deleteAll();
    await argument.model.rooms.deleteAll();
    await argument.model.bls.deleteAll();
    await argument.model.cons.deleteAll();
    await argument.model.kidokus.deleteAll();
    await argument.model.room_bls.deleteAll();
    await argument.model.trans.deleteAll();
    await argument.model.talks.deleteAll();
  });
};
