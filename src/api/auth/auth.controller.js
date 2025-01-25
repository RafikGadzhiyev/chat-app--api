const bcrypt = require('bcrypt');

const authService = require('./auth.service');

const User = require('../../models/User.model');

const enumHelper = require('../../helpers/enum.helper');
const authHelper = require('./auth.helper');

async function signIn(req, res) {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await authService
      .getUser(
        {
          email: email,
        },
      );

    if (!user) {
      return res
        .status(enumHelper.RESPONSE_STATUS_CODES.NOT_FOUND)
        .json(
          {
            message: 'User does not exist!',
          },
        );
    }

    const passwordCompare = bcrypt.compareSync(
      password,
      user.password,
    );

    if (!passwordCompare) {
      return res
        .status(enumHelper.RESPONSE_STATUS_CODES.UNAUTHORIZED)
        .json(
          {
            message: 'Incorrect credentials!',
          },
        );
    }

    const {
      accessToken,
      refreshToken,
    } = authHelper
      .generateTokensAndCookie(
        res,
        {
          _id: user._id,
        },
        {
          [enumHelper.TOKEN_TYPES.ACCESS_TOKEN]: {
            expiresIn: '1h',
          },
          [enumHelper.TOKEN_TYPES.REFRESH_TOKEN]: {
            expiresIn: '30d',
          },
        },

      );

    await User
      .updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            refreshToken: refreshToken,
          },
        },
      );

    res.setHeader(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    delete user.password;

    return res
      .json(
        {
          token: accessToken,
          user: user,
        },
      );
  } catch (err) {
    console.error(err);
  }
}

async function signUp(req, res) {
  try {
    const {
      name,
      email,
      tag,
      password,
    } = req.body;

    const existedUser = await authService.
      getUser(
        {
          $or: [
            {
              email: email,
            },
            {
              tag: tag,
            },
          ],
        },
      );

    if (existedUser) {
      return res
        .status(enumHelper.RESPONSE_STATUS_CODES.BAD_REQUEST)
        .json(
          {
            message: 'User with this email/tag already exists',
          },
        );
    }

    const hashedPassword = authHelper
      .hashPassword(password);

    const newUser = (await User
      .create(
        {
          name: name,
          email: email,
          tag: tag,
          password: hashedPassword,
        },
      ))
      .toObject();

    const {
      accessToken,
      refreshToken,
    } = authHelper
      .generateTokensAndCookie(
        res,
        {
          _id: newUser._id,
        },
        {
          [enumHelper.TOKEN_TYPES.ACCESS_TOKEN]: {
            expiresIn: '1h',
          },
          [enumHelper.TOKEN_TYPES.REFRESH_TOKEN]: {
            expiresIn: '30d',
          },
        },
      );

    await User
      .updateOne(
        {
          _id: newUser._id,
        },
        {
          $set: {
            refreshToken: refreshToken,
          },
        },
      );

    res.setHeader(
      'Authorization',
      `Bearer ${accessToken}`,
    );

    return res
      .json(
        {
          token: accessToken,
          user: newUser,
        },
      );
  } catch (err) {
    console.error(err);

    return res.status(enumHelper.RESPONSE_STATUS_CODES.BAD_REQUEST);
  }
}

async function session(req, res) {
  try {
    const cookies = req.cookies;

    const accessToken = cookies['access-token'];
    const refreshToken = cookies['refresh-token'];

    if (
      !accessToken
      && !refreshToken
    ) {
      return res
        .status(401)
        .end('Unauthorized');
    }

    const tokenPayload = authService
      .validateToken(accessToken, enumHelper.TOKEN_TYPES.ACCESS_TOKEN);

    const refreshTokenPayload = authService
      .validateToken(refreshToken, enumHelper.TOKEN_TYPES.REFRESH_TOKEN);

    if (!refreshTokenPayload) {
      return res
        .status(401)
        .end('Session expired');
    }

    let updatedAccessToken = accessToken;

    if (!tokenPayload) {
      //  re-created access token and refresh token updated
      const { accessToken: newAccessToken } = authHelper
        .generateTokensAndCookie(
          res,
          refreshTokenPayload,
          {},
        );

      res.header('Authorization', `Bearer ${newAccessToken}`);

      updatedAccessToken = newAccessToken;
      // TODO: After refresh => rotate refresh token without time extending|Shifting
    }

    const user = await User
      .findOne(
        {
          _id: refreshTokenPayload._id,
        },
      )
      .lean();

    return res.json(
      {
        token: updatedAccessToken,
        user: user,
      },
    );
  } catch (err) {
    console.error(err);

    return res.status(enumHelper.RESPONSE_STATUS_CODES.BAD_REQUEST);
  }
}

module.exports = {
  signIn,
  signUp,

  session,
};
