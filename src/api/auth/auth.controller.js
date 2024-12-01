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

    const accessToken = authHelper
      .generateToken(
        {
          _id: user._id,
        },
        {
          expiresIn: '1h',
        },
        enumHelper.TOKEN_TYPES.ACCESS_TOKEN,
      );

    const refreshToken = authHelper
      .generateToken(
        {
          _id: user._id,
        },
        {
          expiresIn: '30d',
        },
        enumHelper.TOKEN_TYPES.REFRESH_TOKEN,
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
      userTag,
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
              userTag: userTag,
            },
          ],
        },
      );

    if (existedUser) {
      return res
        .status(enumHelper.RESPONSE_STATUS_CODES.BAD_REQUEST)
        .json(
          {
            message: 'User with this email/userTag already exists',
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
          userTag: userTag,
          password: hashedPassword,
        },
      ))
      .toObject();

    const accessToken = authHelper
      .generateToken(
        {
          _id: newUser._id,
        },
        {
          expiresIn: '1h',
        },
        enumHelper.TOKEN_TYPES.ACCESS_TOKEN,
      );

    const refreshToken = authHelper
      .generateToken(
        {
          _id: newUser._id,
        },
        {
          expiresIn: '30d',
        },
        enumHelper.TOKEN_TYPES.REFRESH_TOKEN,
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
  }
}

module.exports = {
  signIn,
  signUp,
};
