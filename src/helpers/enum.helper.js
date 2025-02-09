const RESPONSE_STATUS_CODES = {
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
};

const TOKEN_TYPES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
};

const ROUTES = {
  INDEX: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  FORGOT_PASSWORD: '/forgot-password',
  CHATS: '/c',
};

const SOCKET_CLIENT_EMIT_EVENTS = {
  NEW_MESSAGE: 'message:new',
  USER_AFTER_LOGIN: 'user:after-login',
};

const SOCKET_EMIT_EVENT = {
  BROADCAST_MESSAGE: 'message:broadcast',
};

module.exports = {
  SOCKET_CLIENT_EMIT_EVENTS,
  RESPONSE_STATUS_CODES,
  SOCKET_EMIT_EVENT,
  TOKEN_TYPES,
  ROUTES,
};
