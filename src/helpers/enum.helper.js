const RESPONSE_STATUS_CODES = {
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

module.exports = {
  RESPONSE_STATUS_CODES,
  TOKEN_TYPES,
  ROUTES,
};
