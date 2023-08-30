const mongoose = require('mongoose');
const httpConstants = require('http2').constants;
const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const { ValidationError, CastError } = mongoose.Error;

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((newMovie) =>
      res.status(httpConstants.HTTP_STATUS_CREATED).send(newMovie)
    )
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(new BadRequestError('Некорретные данные'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Фильма нет в базе'))
    .then((movie) => {
      if (movie.owner == req.user._id) {
        return Movie.deleteOne(movie);
      }
      if (movie.owner !== req.user._id) {
        throw new ForbiddenError('Недостаточно прав для удаления фильма');
      }
    })
    .then((movie) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(movie);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError('Некорретные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
