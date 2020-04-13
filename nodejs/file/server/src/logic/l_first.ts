import { t_argument } from 'src/mongodb';

export const l_first = (params: { socket_list: string[]; ip: string }) => {
  return async (argument: t_argument) => {
    // コネクションチェック
    const _ret = await argument.model.cons.findIp({ ip: params.ip });
    if (_ret.length === 0) {
      return true;
    }

    // データベースにごみが残っていたら
    if (params.socket_list.find(m => m === _ret[0].socketId) === undefined) {
      // 削除
      await argument.model.cons.delete({ socketId: _ret[0].socketId });

      return true;
    }

    return false;
  };
};
