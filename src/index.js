require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const authRouter = require('./api/auth/auth.route');

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

app.use(
  '/api/auth',
  authRouter,
);

app.listen(
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

      console.log('Database has connected');
      console.log(`Server is running on ${PORT} port`);
    } catch (err) {
      console.error(err);
    }
  },
);
