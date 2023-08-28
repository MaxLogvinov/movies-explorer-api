require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
  process.env;
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

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

app.use(
  cors({
    origin: ['https://maxmesto.nomoreparties.co', 'http://localhost:3000'],
    credentials: true,
  })
);

app.use(helmet());

app.listen(PORT, () => {
  console.log('Сервер успешно запущен');
});
