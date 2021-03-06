export const constant = {
  THIS_URL: {
    development: '',
    test: '',
    production: `http://${process.env.SERVER_IP}:${process.env.NGINX_PORT}`
  },

  REQUEST_URL: {
    development: '',
    test: '',
    production: `http://${process.env.SERVER_IP}:${process.env.BACKEND_PORT}`
  },

  JWT_TOKEN: 'jwt_token',

  URL_ROOT: '/',
  URL_AUTH: '/auth',
  URL_LOUNGE: '/lounge',
  URL_ROOM: '/room',

  URL_CREATE_ROOM: '/create_room',
  URL_EXIT_ROOM: '/exit_room',
  URL_ENTERING_ROOM: '/entering_room',

  URL_CREATE_TALK: '/create_talk',
  URL_UPLOAD_FILE: '/upload_file',

  URL_LOGIN: '/login',
  URL_LOGOUT: '/logout',

  URL_UPDATE_NAME_ROOM: '/update_name_room',
  URL_UPDATE_HOST_ROOM: '/update_host_room',
  URL_UPDATE_UPPER_ROOM: '/update_upper_room',
  URL_BAN_ROOM: '/ban_room',

  URL_CREATE_KIDOKU: '/create_kidoku',
  URL_BROADCAST: '/broadcast',
  URL_OBSERVER_ROOM: '/observer_room'
};
