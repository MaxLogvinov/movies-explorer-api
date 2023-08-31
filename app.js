require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT, DB_URL } = process.env;
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('./utils/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose
  .connect(DB_URL, {
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
app.use(rateLimiter);

app.use(
  cors({
    origin: ['http://localhost:4000'],
    credentials: true,
  })
);

app.use(helmet());
app.use(requestLogger);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер успешно запущен на ${PORT}`);
});
