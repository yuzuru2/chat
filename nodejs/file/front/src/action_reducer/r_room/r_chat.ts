/**
 * 定数
 */
const chat_message: string = 'chat_message';

/**
 * interface
 */
export interface i_chat {
  type: string;
  chat_message?: string;
}

/**
 * 初期値
 */
const initialState: i_chat = {
  type: '',
  chat_message: ''
};

/**
 * reducer
 */
export default function r_chat(state = initialState, action: i_chat) {
  let param: i_chat = {
    type: action.type
  };

  switch (action.type) {
    case chat_message:
      if (action.chat_message.length <= 150) {
        param.chat_message = action.chat_message;
        return Object.assign({}, state, param);
      }
      return state;
    default:
      return state;
  }
}

/**
 * action
 */
export const a_chat = {
  chat_message: (message: string) => {
    return { type: chat_message, chat_message: message };
  }
};
