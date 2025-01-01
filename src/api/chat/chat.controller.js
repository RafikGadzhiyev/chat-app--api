const Chat = require('./../../models/Chat.model');

const chatHelper = require('./chat.helper');

async function create(req, res) {
  try {
    const {
      title,
      description,
      memberEmails,
    } = req.body;

    const actualMetadata = chatHelper
      .getActualMetadata(req.body);

    const createdChat = (
      await Chat
        .create(
          {
            title,
            description,
            memberEmails,
            meta: actualMetadata,
          },
        )
    )
      .toObject();

    return res.json(createdChat);
  } catch (err) {
    console.error(err);

    return res
      .status(500)
      .end('Internal Server Error');
  }
}

async function getById(req, res) {
  try {
    const {
      id: chatId,
    } = req.params;

    const chat = await Chat
      .findOne(
        {
          _id: chatId,
        },
      )
      .lean();

    return res.json(chat);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .end('Internal Server Error');
  }
}

async function get(req, res) {
  try {
    const {
      memberEmails,
    } = req.query;

    const chats = await Chat
      .find(
        {
          memberEmails: {
            $in: memberEmails,
          },
        },
      )
      .lean();

    return res
      .json(chats);
  } catch (err) {
    console.error(err);

    return res.status(500)
      .end('Internal server Error');
  }
}

module.exports = {
  create,

  get,
  getById,
};
