const User = require('../../models/User.model');

const enumHelper = require('../../helpers/enum.helper');

async function getUsers(req, res) {
  try {
    // TODO: Add query

    const users = await User
      .find(
        {},
        {
          email: 1,
          name: 1,
        },
      )
      .lean();

    return res
      .json(
        users,
      );
  } catch (err) {
    console.error(err);

    return res
      .status(enumHelper.RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .message(
        {
          message: 'Internal server error!',
        },
      );
  }
}

module.exports = {
  getUsers,
};
