require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 4000, DB_URL, NODE_ENV } = process.env;
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./utils/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DEV_DB_URL } = require('./utils/constants');

mongoose
  .connect(NODE_ENV === 'production' ? DB_URL : DEV_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => {
    console.log('BD is working');
  })
  .catch(() => {
    console.log('BD is not working');
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3000/',
      'https://diploma.maxlogvinov.nomoredomainsicu.ru',
    ],
    credentials: true,
  })
);

app.use(rateLimiter);

app.use(helmet());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на ${PORT}`);
});
