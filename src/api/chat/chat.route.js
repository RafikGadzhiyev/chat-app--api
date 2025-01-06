const express = require('express');

const router = express.Router();

const chatController = require('./chat.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

router.get(
  '/',
  chatController.get,
);

router.get(
  '/:id',
  chatController.getById,
);

router.post(
  '/new',
  authMiddleware.isAuthenticated,
  chatController.create,
);

module.exports = router;
