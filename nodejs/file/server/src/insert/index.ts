/**
 * db
 */
import { Mongodb, t_argument } from 'src/mongodb';

/**
 * logic
 */
import { l_create_room } from 'src/logic/l_create_room';

/**
 * 定数
 */
import { constant } from 'src/constant';

const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const main = async () => {
  console.log(new Date());
  let roomId;
  let room_name = 0;

  for (let i = 0; i < 1000; i++) {
    try {
      // ユーザ作成
      const r_name = Math.floor(Math.random() * 15) + 1;
      let user_name = '';
      for (let j = 0; j < r_name; j++) {
        user_name += s[Math.floor(Math.random() * s.length)];
      }

      const _userId = await new Mongodb<string>().normalMethod(
        async (argument: t_argument) => {
          return argument.model.users.insert({
            iconId: Math.floor(Math.random() * 26),
            name: user_name,
            ip: '1.1.1.1'
          });
        }
      );

      // %14で部屋作成
      if (i % 14 === 0) {
        // 部屋作成
        roomId = await new Mongodb<string>().normalMethod(
          l_create_room({
            hostId: _userId,
            upper: 15,
            name: room_name++ + ''
          })
        );
      } else {
        // 入室
        await new Mongodb<void>().normalMethod(async (argument: t_argument) => {
          await argument.model.users.updateRoomId(
            { userId: _userId },
            { roomId: roomId }
          );
        });
      }
    } catch (e) {}
  }

  console.log(new Date());
  console.log('fin');
};

main();
