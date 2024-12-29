// TODO: req.user = user for authenticated users
async function isAuthenticated(req, res, next) {
  const authorizationHeader = req.headers['Authorization'];

  if (!authorizationHeader) {
    res.redirect('http://localhost:3000/sign-in');
    return next();
  }

  const splittedAuthorizationHeader = authorizationHeader
    .split(' ');

  const token = splittedAuthorizationHeader[1];

  if (!token) {
    res.redirect(('/sign-in'));
    return next();
  }

  return next();
}

module.exports = {
  isAuthenticated,
};
