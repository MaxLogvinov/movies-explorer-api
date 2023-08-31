const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const httpConstants = require('http2').constants;
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictingRequest = require('../errors/ConflictingRequest');

const { ValidationError, CastError } = mongoose.Error;
const { generateToken } = require('../utils/token');

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Данного пользователя  нет в базе'))
    .then((user) => {
      res
        .status(httpConstants.HTTP_STATUS_OK)
        .send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new BadRequestError('Некорретные данные'));
      }

      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      res
        .status(httpConstants.HTTP_STATUS_OK)
        .send({ name: user.name, email: user.email });
    })
    .catch((err) => {
      if (err.code == 11000) {
        return next(
          new ConflictingRequest(
            'Пользователь с данной почтой уже зарегестрирован'
          )
        );
      }
      if (err instanceof ValidationError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send({
        name: user.name,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Некорретные данные'));
      }
      if (err.code === 11000) {
        return next(
          new ConflictingRequest(
            'Пользователь с данной почтой уже зарегестрирован'
          )
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user._id);
      res.cookie('jwt', token, {
        maxAge: 60480000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Авторизация успешна!' });
    })
    .catch(next);
};

const signOut = (req, res) => {
  if (res.cookie) {
    res.clearCookie('jwt');
    res.send({ message: 'Вы успешно вышли из аккаунта!' });
  }
};

module.exports = {
  getUserInfo,
  updateUser,
  createUser,
  login,
  signOut,
};
