const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    memberEmails: {
      type: [String],
    },
    meta: {
      membersCount: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
