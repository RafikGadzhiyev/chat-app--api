const User = require('./../../models/User.model');

async function getUser(searchQuery) {
  const user = await User
    .findOne(
      searchQuery,
    )
    .lean();

  return user;
}

module.exports = {
  getUser,
};
