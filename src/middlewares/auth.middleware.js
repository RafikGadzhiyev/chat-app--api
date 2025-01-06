const User = require('../models/User.model');

const authService = require('../api/auth/auth.service');

const enumHelper = require('../helpers/enum.helper');

async function isAuthenticated(req, res, next) {
  try {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      // TODO: do real redirect
      res.redirect(enumHelper.ROUTES.SIGN_IN);
      return;
    }

    const splittedAuthorizationHeader = authorizationHeader
      .split(' ');

    const token = splittedAuthorizationHeader[1];

    if (!token) {
      // TODO: do real redirect
      res.redirect(enumHelper.ROUTES.SIGN_IN);
      return;
    }

    const tokenPayload = authService
      .validateToken(
        token,
        enumHelper.TOKEN_TYPES.ACCESS_TOKEN,
      );

    const user =  await User
      .findOne(
        {
          _id: tokenPayload._id,
        },
        {
          name: 1,
          email: 1,
          tag: 1,
          // TODO: Delete after removing legacy data
          userTag: 1,
        },
      )
      .lean();

    if (!user) {
      // TODO: Do real redirect
      res.redirect(enumHelper.ROUTES.SIGN_IN);
      return;
    }

    req.user = user;

    return next();
  } catch (err) {
    // TODO: Maybe custom logger that will store logs in DB?
    console.error(err);

    return res
      .status(enumHelper.RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(
        {
          message: 'Internal server error',
        },
      );
  }
}

module.exports = {
  isAuthenticated,
};
