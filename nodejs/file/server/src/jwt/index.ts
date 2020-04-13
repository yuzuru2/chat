// npm i --save jsonwebtoken @types/jsonwebtoken
import * as jwt from 'jsonwebtoken';

/**
 * jwtトークンをエンコードする
 * @param payload
 * @param private_key 秘密鍵
 */
export const encode = <T>(payload: T, private_key: jwt.Secret): string => {
  return jwt.sign(payload as {}, private_key, { algorithm: 'RS256' });
};

/**
 * jwtトークンをデコードする
 * @param token
 * @param public_key 公開鍵
 */
export const decode = <T>(token: string, public_key: Buffer): Promise<T> => {
  return new Promise(resolve => {
    if (token == null || token === 'null' || token === '') {
      resolve(null);
      return;
    }

    jwt.verify(token, public_key, (err, decoded: {}) => {
      if (err) {
        resolve(undefined);
      }

      resolve(decoded as T);
    });
  });
};
