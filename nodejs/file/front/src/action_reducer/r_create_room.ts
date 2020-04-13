/**
 * 定数
 */
const create_room_name: string = 'create_room_name';
const create_room_upper: string = 'create_room_upper';
const create_room_display: string = 'create_room_display';

/**
 * interface
 */
export interface i_create_room {
  type: string;
  create_room_name?: string;
  create_room_upper?: number;
  display?: boolean;
}

/**
 * 初期値
 */
const initialState: i_create_room = {
  type: '',
  create_room_name: '',
  create_room_upper: 5,
  display: false
};

/**
 * reducer
 */
export default function r_create_room(
  state = initialState,
  action: i_create_room
) {
  let param: i_create_room = {
    type: action.type
  };

  switch (action.type) {
    // 20文字以内
    case create_room_name:
      if (action.create_room_name.length <= 20) {
        param.create_room_name = action.create_room_name;
        return Object.assign({}, state, param);
      }
      return state;
    // 2以上15以下
    case create_room_upper:
      if (action.create_room_upper >= 2 && action.create_room_upper <= 15) {
        param.create_room_upper = action.create_room_upper;
        return Object.assign({}, state, param);
      }
      return state;
    case create_room_display:
      param.display = action.display;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_create_room = {
  create_room_name: (name: string) => {
    return { type: create_room_name, create_room_name: name };
  },
  create_room_upper: (upper: number) => {
    return { type: create_room_upper, create_room_upper: upper };
  },
  create_room_display: (display: boolean) => {
    return { type: create_room_display, display: display };
  }
};
