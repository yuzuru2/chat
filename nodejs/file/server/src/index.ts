process.env.TZ = 'Asia/Tokyo';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import { init } from 'src/socketio';

// socketioスタート
init();
