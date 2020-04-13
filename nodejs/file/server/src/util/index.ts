import * as fs from 'fs';
import * as moment from 'moment';

/**
 * エラーログ書き込み
 */
export const write_error_log = (error): Promise<void> => {
  return new Promise(async resolve => {
    // testなら
    if (process.env.NODE_ENV === 'test') {
      resolve();
      return;
    }

    const _body =
      moment(new Date()).format('YYYY-MM-DD HH:mm:ss') + '\n' + error + '\n\n';

    fs.mkdir(`${process.cwd()}/log`, () => {
      fs.appendFile(`${process.cwd()}/log/error.log`, _body, () => {
        resolve();
      });
    });
  });
};
