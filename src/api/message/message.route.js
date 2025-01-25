const express = require('express');

const router = express.Router();

const messageController = require('./message.controller');

const authMiddleware = require('../../middlewares/auth.middleware');

router.get(
  '/',
  authMiddleware.isAuthenticated,
  messageController.getChatMessages,
);

router.post(
  '/create',
  authMiddleware.isAuthenticated,
  messageController.createChatMessage,
);

router.get(
  '/delete',
  authMiddleware.isAuthenticated,
  messageController.deleteChatMessage,
);

module.exports = router;
