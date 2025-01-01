const express = require('express');

const router = express.Router();

const chatController = require('./chat.controller');

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
  chatController.create,
);

module.exports = router;
