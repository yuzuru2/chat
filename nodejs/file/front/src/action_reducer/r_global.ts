/**
 * 定数
 */
const global_first: string = 'global_first';

/**
 * interface
 */
export interface i_global {
  type: string;
  first?: boolean;
}

/**
 * 初期値
 */
const initialState: i_global = {
  type: '',
  first: false
};

/**
 * reducer
 */
export default function r_global(state = initialState, action: i_global) {
  let param: i_global = {
    type: action.type
  };

  switch (action.type) {
    case global_first:
      param.first = action.first;
      return Object.assign({}, state, param);
    default:
      return state;
  }
}

/**
 * action
 */
export const a_global = {
  set_first: (bol: boolean) => {
    return { type: global_first, first: bol };
  }
};
