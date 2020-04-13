/**
 * コアモジュール
 */
const fileType = require('file-type');

/**
 * store
 */
import { store } from 'src';

/**
 * api
 */
import { socket } from 'src/socketio';

/**
 * action
 */
import { a_chat } from 'src/action_reducer/r_room/r_chat';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * チャット画面イベント
 */
export const e_chat = {
  // 退室ボタン押下時
  exit_room: async () =>
    window.confirm('退室しますか?')
      ? socket.emit(constant.URL_EXIT_ROOM, {})
      : '',

  // メッセージ入力時
  set_message: (message: string) =>
    store.dispatch(a_chat.chat_message(message)),

  // 送信ボタン押下時
  submit: async (message: string) => {
    document.getElementById('chat_textarea').blur();
    if (message.length === 0) {
      alert('未入力です');
      return;
    }

    socket.emit(constant.URL_CREATE_TALK, { message: message });
    store.dispatch(a_chat.chat_message(''));
  },

  // 画像ボタン押下時
  file_upload: (file: FileList) => {
    const reader = new FileReader();

    reader.onload = async function(event: any) {
      const base64 = event.target.result;

      // 余計な文字列を取り除く
      const file_data = base64.replace(/^data:\w+\/\w+;base64,/, '');

      // デコード
      const decode_file = Buffer.from(file_data, 'base64');

      const size = decode_file.length / 1000;

      // 画像データが1MB以上なら
      if (size > 1000) {
        alert('ファイルサイズは1MBまでです');
        return;
      }

      try {
        const type = fileType(decode_file);
        if (
          type.mime === 'image/jpeg' ||
          type.mime === 'image/png' ||
          type.mime === 'image/gif'
        ) {
        } else {
          throw new Error('');
        }
      } catch (e) {
        alert('画像ファイルが選択されていません');
        return;
      }

      socket.emit(constant.URL_UPLOAD_FILE, { upload: decode_file });
    };

    if (file[0] === undefined) {
      alert('ファイルが選択されていません');
    } else {
      reader.readAsDataURL(file[0]);
    }
  }
};
