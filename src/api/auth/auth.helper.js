const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const enumHelper = require('./../../helpers/enum.helper');

/**
 * @description hashed given password
 *
 * @param plainPassword {String}
 * @return {String}
 */
function hashPassword(plainPassword) {
  const SALT_ROUND = parseInt(process.env.AUTH_SALT_ROUNDS);

  const salt = bcrypt.genSaltSync(SALT_ROUND);

  return bcrypt.hashSync(plainPassword, salt);
}

/**
 * @description generates token
 *
 * @param payload {any}
 * @param options {Object}
 * @param tokenType {'access_token' | 'refresh_token' | undefined}
 * @return {String}
 */
function generateToken(payload, options, tokenType) {
  let tokenSecret = process.env.TOKEN_SECRET;

  if (tokenType === enumHelper.TOKEN_TYPES.ACCESS_TOKEN) {
    tokenSecret = process.env.ACCESS_TOKEN_SECRET;
  } else if (tokenType === enumHelper.TOKEN_TYPES.REFRESH_TOKEN) {
    tokenSecret = process.env.REFRESH_TOKEN_SECRET;
  }

  return jwt.sign(
    payload,
    tokenSecret,
    options,
  );
}

function generateTokensAndCookie(res, payload, optionsPerTokenType) {
  const accessTokenOptions = optionsPerTokenType[enumHelper.TOKEN_TYPES.ACCESS_TOKEN]
    || {};

  const refreshTokenOptions = optionsPerTokenType[enumHelper.TOKEN_TYPES.REFRESH_TOKEN]
    || {};

  const accessToken = generateToken(
    payload,
    accessTokenOptions,
    enumHelper.TOKEN_TYPES.ACCESS_TOKEN,
  );

  const refreshToken = generateToken(
    payload,
    refreshTokenOptions,
    enumHelper.TOKEN_TYPES.REFRESH_TOKEN,
  );

  res.cookie(
    'access-token',
    accessToken,
    {
      ...accessTokenOptions,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  );

  res.cookie(
    'refresh-token',
    refreshToken,
    {
      ...refreshTokenOptions,
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    },
  );

  return {
    accessToken,
    refreshToken,
  };
}

module.exports = {
  hashPassword,
  generateToken,
  generateTokensAndCookie,
};
