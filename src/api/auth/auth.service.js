const User = require('./../../models/User.model');

async function getUser(searchQuery) {
  const user = await User
    .findOne(
      searchQuery,
    )
    .select('+password')
    .lean();

  return user;
}

module.exports = {
  getUser,
};
