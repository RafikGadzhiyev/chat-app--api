require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRouter = require('./api/auth/auth.route');

const PORT = process.env.PORT || 8080;

app.use(
  express.json(),
);

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
