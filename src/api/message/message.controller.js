const Message = require('../../models/Message.model');

const enumHelper = require('../../helpers/enum.helper');

async function getChatMessages(req, res) {
  try {
    const {
      chatId,
    } = req.query;

    const messages = await Message
      .find(
        {
          chatId: chatId,
        },
      )
      .lean();

    return res.json(messages);
  } catch (err) {
    console.error(err);
  }
}

async function createChatMessage(req, res) {
  try {
    const {
      message,
    } = req.body;

    const createdMessage = (await Message
      .create(message))
      .toObject();

    return res.json(createdMessage);
  } catch (err) {
    console.error(err);
  }
}

async function deleteChatMessage(req, res) {
  try {
    const {
      messageId,
    } = req.query;

    await Message
      .deleteOne(
        {
          _id: messageId,
        },
      );

    return res
      .status(enumHelper.RESPONSE_STATUS_CODES.NO_CONTENT)
      .end();
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  deleteChatMessage,
  getChatMessages,
  createChatMessage,
};
