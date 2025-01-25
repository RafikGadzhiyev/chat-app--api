const express = require('express');

const controller = require('./auth.controller');

const router = express.Router();

router.get(
  '/session',
  controller.session,
);

router.post(
  '/sign-in',
  controller.signIn,
);

router.post(
  '/sign-up',
  controller.signUp,
);

module.exports = router;
