import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { decode, encode } from 'src/jwt';

// 公開鍵
const public_key: Buffer = fs.readFileSync(
  `${process.cwd()}/key/public-key.pem`
);

// 秘密鍵
const private_key: jwt.Secret = fs.readFileSync(
  `${process.cwd()}/key/private-key.pem`
);

// ペイロードの型
interface i_payload {
  userId: string;
}

describe('decode', () => {
  test('nullを渡したら、nullを返す', async () => {
    expect(await decode(null, public_key)).toBe(null);
  });

  test(' ""を渡したら、nullを返す', async () => {
    expect(await decode('', public_key)).toBe(null);
  });

  test('改ざんしたトークンを渡したら、undifinedを返す', async () => {
    expect(await decode('123', public_key)).toBe(undefined);
  });

  test('正常なトークンを渡したら、{userId: "abc"}を返す', async () => {
    const _payload: i_payload = {
      userId: 'abc'
    };

    // トークン取得
    const _token = encode<i_payload>(_payload, private_key);
    expect((await decode<i_payload>(_token, public_key)).userId).toBe(
      _payload.userId
    );
  });
});

describe('encode', () => {
  test('encodeできるか', async () => {
    expect(
      typeof encode<i_payload>({ userId: 'fdfd' }, private_key) === 'string'
    ).toBe(true);
  });
});
