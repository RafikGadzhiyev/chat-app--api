require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const Chat = require('./models/Chat.model');

const enumHelper = require('./helpers/enum.helper');

const app = express();
const server = createServer(app);
const io = new Server(
  server,
  {
    cors: process.env.FRONTEND_BASE_URL,
  },
);

const authRouter = require('./api/auth/auth.route');
const chatRouter = require('./api/chat/chat.route');
const userRouter = require('./api/user/user.route');
const messageRouter = require('./api/message/message.route');

const PORT = process.env.PORT || 8080;

app.use(
  cors(
    {
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
    },
  ),
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);
app.use('/api/message', messageRouter);

server.listen(
  PORT,
  async () => {
    try {
      await mongoose.connect(
        process.env.MONGO_DB_URI,
        {
          connectTimeoutMS: 5000,
          socketTimeoutMS: 20000,
          heartbeatFrequencyMS: 10000,
        },
      );

      io
        .on(
          'connection',
          (socket) => {
            console.log('New connection', socket.id);

            socket.on(
              enumHelper.SOCKET_CLIENT_EMIT_EVENTS.USER_AFTER_LOGIN,
              (payload) => {
                if (socket.rooms.has(`user:${payload.email}`)) {
                  return;
                }
                // Unique user room
                socket.join(`user:${payload.email}`);
              },
            );

            socket.on(
              enumHelper.SOCKET_CLIENT_EMIT_EVENTS.NEW_MESSAGE,
              async (payload) => {
                const chat = await Chat
                  .findOne(
                    {
                      _id: payload.message.chatId,
                    },
                    {
                      memberEmails: 1,
                    },
                  )
                  .lean();

                for (let i = 0; i < chat.memberEmails.length; i += 1) {
                  const memberEmail = chat.memberEmails[i];

                  const memberUniqueSocketChannel = `user:${memberEmail}`;

                  socket.to(memberUniqueSocketChannel)
                    .emit(
                      enumHelper.SOCKET_EMIT_EVENT.BROADCAST_MESSAGE,
                      {
                        message: payload.message,
                      },
                    );
                }
              },
            );
          },
        );

      console.log('Database has connected');
      console.log(`Server is running on ${PORT} port`);
    } catch (err) {
      console.error(err);
    }
  },
);
