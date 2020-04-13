/**
 * action_reducer
 */
import { Props } from 'src/action_reducer';

/**
 * socket
 */
import { socket } from 'src/socketio';

/**
 * u_shouldComponentUpdateのようなメソッド
 * @param prevProps
 * @param nextProps
 * @param api
 * @param prev_reducer_display
 * @param next_reducer_display
 * @param reducer_name
 */
export const u_shouldComponentUpdate = (
  prevProps: Props,
  nextProps: Props,
  api_name: string,
  prev_reducer_display: boolean,
  next_reducer_display: boolean,
  reducer_name?: string
) => {
  // オフ画面になる時
  if (prevProps.r_global.first && !nextProps.r_global.first) {
    return false;
  }

  // socket接続時
  if (!prevProps.r_global.first && nextProps.r_global.first) {
    socket.emit(api_name, {});
    return false;
  }

  // apiリクエストが終了した時
  if (!prev_reducer_display && next_reducer_display) {
    return false;
  }

  // 画面遷移時
  if (prev_reducer_display && !next_reducer_display) {
    return true;
  }

  if (
    JSON.stringify(prevProps[reducer_name]) !==
    JSON.stringify(nextProps[reducer_name])
  ) {
    return false;
  }

  return true;
};
