const express = require('express');

const controller = require('./auth.controller');

const router = express.Router();

router.post(
  '/sign-in',
  controller.signIn,
);

router.post(
  '/sign-up',
  controller.signUp,
);

module.exports = router;
