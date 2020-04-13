/**
 * コアモジュール
 */
import * as file_type from 'file-type';
import * as fs from 'fs';

/**
 * 定数
 */
import { constant } from 'src/constant';

import { t_argument } from 'src/mongodb';

/**
 * 画像のファイル名
 */
const get_filename = () => {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return (
    [...Array(30)].map(() => s[Math.floor(Math.random() * s.length)]).join('') +
    new Date().getTime()
  );
};

/**
 * 画像チェック
 * @param file
 */
const image_processing = (file: Buffer) => {
  // ファイルタイプ
  const _type = file_type(file);

  if (
    _type.mime === 'image/jpeg' ||
    _type.mime === 'image/png' ||
    _type.mime === 'image/gif'
  ) {
  } else {
    throw new Error('l_upload 画像ファイルでない');
  }

  // 1MBより大きいなら
  if (file.length > 1000000) {
    throw new Error('l_upload ファイルサイズオーバー');
  }

  return _type.ext;
};

export const l_upload = (params: {
  userId: string;
  roomId: string;
  ip: string;
  upload_file: Buffer;
}) => {
  return async (argument: t_argument) => {
    // 部屋情報
    const _roominfo = await argument.model.users.aggregate_roominfo({
      roomId: params.roomId
    });

    // ユーザ情報
    const _userinfo = _roominfo.find(m => m.userId === params.userId);

    if (_userinfo === undefined) {
      throw new Error('l_upload ユーザが部屋にいない');
    }

    // ファイル名
    const _file_name = `${get_filename()}.${image_processing(
      params.upload_file
    )}`;

    // 投稿
    await argument.model.talks.insert({
      roomId: params.roomId,
      roomName: _roominfo[0].roomName,
      userId: params.userId,
      userName: _userinfo.userName,
      iconId: _userinfo.iconId,
      ip: params.ip,
      kind: 1,
      message: _file_name
    });

    // ディスクに書き込む
    fs.writeFile(
      `${constant.PATH_UPLOAD_FILE[process.env.NODE_ENV]}${_file_name}`,
      params.upload_file,
      'utf8',
      err => {}
    );
  };
};
