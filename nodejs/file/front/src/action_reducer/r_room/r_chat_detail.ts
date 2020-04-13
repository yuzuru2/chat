/**
 * 定数
 */
const chat_detail_room_name: string = 'chat_detail_room_name';
const chat_detail_choise_id: string = 'chat_detail_choise_id';

/**
 * interface
 */
export interface i_chat_detail {
  type: string;
  chat_detail_room_name?: string;
  chat_detail_choise_id?: string;
}

/**
 * 初期値
 */
const initialState: i_chat_detail = {
  type: '',
  chat_detail_room_name: '',
  chat_detail_choise_id: ''
};

/**
 * reducer
 */
export default function r_chat_detail(
  state = initialState,
  action: i_chat_detail
) {
  let param: i_chat_detail = {
    type: action.type
  };

  switch (action.type) {
    case chat_detail_room_name:
      if (action.chat_detail_room_name.length <= 20) {
        param.chat_detail_room_name = action.chat_detail_room_name;
        return Object.assign({}, state, param);
      }
      return state;
    case chat_detail_choise_id:
      param.chat_detail_choise_id = action.chat_detail_choise_id;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_chat_detail = {
  chat_detail_room_name: (name: string) => {
    return { type: chat_detail_room_name, chat_detail_room_name: name };
  },
  chat_detail_choise_id: (choise_id: string) => {
    return { type: chat_detail_choise_id, chat_detail_choise_id: choise_id };
  }
};
