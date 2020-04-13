/**
 * 定数
 */
const lounge_room_list: string = 'lounge_room_list';
const lounge_display: string = 'lounge_display';

/**
 * interface
 */
import { i_q_room_member } from 'src/interface';

/**
 * interface
 */
export interface i_lounge {
  type: string;
  room_list?: i_q_room_member[];
  display?: boolean;
}

/**
 * 初期値
 */
const initialState: i_lounge = {
  type: '',
  room_list: [],
  display: false
};

/**
 * reducer
 */
export default function r_lounge(state = initialState, action: i_lounge) {
  let param: i_lounge = {
    type: action.type
  };

  switch (action.type) {
    case lounge_room_list:
      param.room_list = action.room_list;
      param.display = action.display;
      return Object.assign({}, state, param);
    case lounge_display:
      param.display = action.display;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_lounge = {
  set_room_list: (room_list: i_q_room_member[], display: boolean) => {
    return {
      type: lounge_room_list,
      room_list: room_list,
      display: display
    };
  },
  lounge_display: (display: boolean) => {
    return { type: lounge_display, display: display };
  }
};
