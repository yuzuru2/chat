/**
 * 定数
 */
const room_data: string = 'room_data';
const room_display: string = 'room_display';

/**
 * interface
 */
import { i_q_talk_list, i_q_room_member } from 'src/interface';

/**
 * interface
 */
export interface i_room {
  type: string;
  room_member?: i_q_room_member[];
  talk_list?: i_q_talk_list[];
  user_id?: string;
  display?: boolean;
}

/**
 * 初期値
 */
const initialState: i_room = {
  type: '',
  talk_list: [],
  room_member: [],
  user_id: 'b',
  display: false
};

/**
 * reducer
 */
export default function r_room(state = initialState, action: i_room) {
  let param: i_room = {
    type: action.type
  };

  switch (action.type) {
    case room_data:
      param.room_member = action.room_member;
      param.talk_list = action.talk_list;
      param.user_id = action.user_id;
      param.display = action.display;
      return Object.assign({}, state, param);
    case room_display:
      param.display = action.display;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_room = {
  room_data: (params: {
    room_member: i_q_room_member[];
    talk_list: i_q_talk_list[];
    user_id: string;
    display: boolean;
  }) => {
    return {
      type: room_data,
      room_member: params.room_member,
      talk_list: params.talk_list,
      user_id: params.user_id,
      display: params.display
    };
  },
  room_display: (display: boolean) => {
    return { type: room_display, display: display };
  }
};
