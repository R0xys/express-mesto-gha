const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

function getUser(userId, res, errHandle, next) {
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      errHandle(err, next);
    });
}

function getUserByIdDecorator(func) {
  function errHandle(err, next) {
    if (err instanceof mongoose.Error.CastError) next(new BadRequestError('Переданы некорректные данные в метод получения пользователя'));
    else next(err);
  }
  return (req, res, next) => {
    const userId = req.params;
    func(userId, res, errHandle, next);
  };
}

function getUserInfoDecorator(func) {
  function errHandle(err, next) {
    next(err);
  }
  return (req, res, next) => {
    const userId = req.user._id;
    func(userId, res, errHandle, next);
  };
}

module.exports.getUserById = getUserByIdDecorator(getUser);
module.exports.getUserInfo = getUserInfoDecorator(getUser);
