/**
 * 定数
 */
const login_name: string = 'login_name';
const login_icon_id: string = 'login_icon_id';
const login_display: string = 'login_room_display';

/**
 * interface
 */
export interface i_login {
  type: string;
  login_name?: string;
  login_icon_id?: number;
  display?: boolean;
}

/**
 * 初期値
 */
const initialState: i_login = {
  type: '',
  login_name: '',
  login_icon_id: 0,
  display: false
};

/**
 * reducer
 */
export default function r_login(state = initialState, action: i_login) {
  let param: i_login = {
    type: action.type
  };

  switch (action.type) {
    // 15文字以内
    case login_name:
      if (action.login_name.length <= 15) {
        param.login_name = action.login_name;
        return Object.assign({}, state, param);
      }
      return state;
    // 0以上25以下
    case login_icon_id:
      if (action.login_icon_id >= 0 && action.login_icon_id <= 25) {
        param.login_icon_id = action.login_icon_id;
        return Object.assign({}, state, param);
      }
      return state;
    case login_display:
      param.display = action.display;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_login = {
  login_name: (name: string) => {
    return { type: login_name, login_name: name };
  },
  login_icon_id: (icon_id: number) => {
    return { type: login_icon_id, login_icon_id: icon_id };
  },
  login_display: (display: boolean) => {
    return { type: login_display, display: display };
  }
};
