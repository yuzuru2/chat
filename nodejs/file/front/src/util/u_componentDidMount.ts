/**
 * socket
 */
import { socket } from 'src/socketio';

/**
 * componentDidMountのようなメソッド
 * @param api
 * @param global_flag
 */
export const u_componentDidMount = async (
  api_name: string,
  global_flag: boolean
) => {
  global_flag ? socket.emit(api_name, {}) : '';

  return () => {};
};
