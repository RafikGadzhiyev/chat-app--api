const User = require('./../../models/User.model');
const jwt = require('jsonwebtoken');
const enumHelper = require('../../helpers/enum.helper');

async function getUser(searchQuery) {
  const user = await User
    .findOne(
      searchQuery,
    )
    .select('+password')
    .lean();

  return user;
}

function validateToken(token, tokenType) {
  try {
    let tokenSecret = process.env.TOKEN_SECRET;

    if (tokenType === enumHelper.TOKEN_TYPES.ACCESS_TOKEN) {
      tokenSecret = process.env.ACCESS_TOKEN_SECRET;
    } else if (tokenType === enumHelper.TOKEN_TYPES.REFRESH_TOKEN) {
      tokenSecret = process.env.REFRESH_TOKEN_SECRET;
    }

    return jwt.verify(
      token,
      tokenSecret,
    );
  } catch (err) {
    console.error(err);

    return null;
  }
}

module.exports = {
  getUser,

  validateToken,
};
