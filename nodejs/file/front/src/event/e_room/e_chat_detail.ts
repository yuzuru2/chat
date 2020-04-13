/**
 * store
 */
import { store } from 'src';

/**
 * action
 */
import { a_chat_detail } from 'src/action_reducer/r_room/r_chat_detail';

/**
 * api
 */
import { socket } from 'src/socketio';

/**
 * 定数
 */
import { constant } from 'src/constant';

/**
 * 権限移譲時
 * 追放時
 */
const func_change = (): boolean => {
  const _myid = store.getState().r_room.user_id;
  const _choise_id = store.getState().r_chat_detail.chat_detail_choise_id;
  const _room_member = store.getState().r_room.room_member;

  if (_myid === _choise_id || _choise_id === '') {
    alert('上のアイコンからユーザを選んでください');
    return false;
  }

  if (_room_member.find(m => m.userId === _choise_id) === undefined) {
    alert('上のアイコンからユーザを選んでください');
    return false;
  }

  return true;
};

/**
 * 部屋詳細画面イベント
 */
export const e_chat_detail = {
  // 退室ボタン押下時
  exit_room: async () =>
    window.confirm('退室しますか?')
      ? socket.emit(constant.URL_EXIT_ROOM, {})
      : '',

  // 部屋名変更時
  set_room_name: (name: string) =>
    store.dispatch(a_chat_detail.chat_detail_room_name(name)),

  // アイコン選択時
  choise_user: (choise_id: string) =>
    store.dispatch(a_chat_detail.chat_detail_choise_id(choise_id)),

  // 部屋上限選択時
  set_upper: async (upper: number) =>
    socket.emit(constant.URL_UPDATE_UPPER_ROOM, { upper: upper }),

  // 部屋名変更ボタン押下時
  submit_room_name: async () => {
    const _name = store.getState().r_chat_detail.chat_detail_room_name;

    _name.length === 0
      ? alert('新しい部屋名が未入力です')
      : socket.emit(constant.URL_UPDATE_NAME_ROOM, { name: _name });
  },

  // 権限移譲ボタン押下時
  change_host: async () => {
    if (!func_change()) {
      return;
    }

    window.confirm('権限を委譲しますか?')
      ? socket.emit(constant.URL_UPDATE_HOST_ROOM, {
          hostId: store.getState().r_chat_detail.chat_detail_choise_id
        })
      : '';
  },

  // 追放ボタン押下時
  kick: async () => {
    if (!func_change()) {
      return;
    }

    window.confirm('追放しますか?')
      ? socket.emit(constant.URL_BAN_ROOM, {
          banId: store.getState().r_chat_detail.chat_detail_choise_id
        })
      : '';
  }
};
