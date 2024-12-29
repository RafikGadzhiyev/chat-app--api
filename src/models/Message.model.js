const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    // link to media
    attachedMedia: {
      type: {
        mediaType: String,
        link: String,
      },
    },
    attachedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readBy: {
      type: [String],
    },
    meta: {
      isEdited: Boolean,
      isForwarded: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
