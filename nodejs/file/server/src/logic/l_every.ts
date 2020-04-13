import { t_argument } from 'src/mongodb';

/**
 * jwt
 */
import { decode } from 'src/jwt';

/**
 * 定数
 */
import { constant } from 'src/constant';

export const l_every = (params: { jwt_token: string; ip: string }) => {
  return async (argument: t_argument) => {
    // ブラックリストチェック
    if ((await argument.model.bls.find(params.ip)).length > 0) {
      return undefined;
    }

    // jwtデコード
    const _payload = await decode<{ userId: string }>(
      params.jwt_token,
      constant.PUBLIC_KEY
    );

    // 改ざんしたトークンだったらブラックリスト入り
    if (_payload === undefined) {
      await argument.model.bls.insert(params.ip);
      return undefined;
    }

    // 初回アクセスなら
    if (_payload === null) {
      return null;
    }

    // ユーザチェック
    const _user = await argument.model.users.findUser({
      userId: _payload.userId
    });

    if (_user.length > 0) {
      // ユーザ更新
      await argument.model.users.updateIp(
        { userId: _payload.userId },
        { ip: params.ip }
      );

      return {
        userId: _user[0].userId,
        roomId: _user[0].roomId
      };
    }

    return null;
  };
};
