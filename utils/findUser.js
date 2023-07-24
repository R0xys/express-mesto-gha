const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

function getUser(userId, res, next) {
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequestError('Переданы некорректные данные в метод получения пользователя'));
      else next(err);
    });
}

function getUserByIdDecorator(func) {
  return (req, res, next) => {
    const { userId } = req.params;
    func(userId, res, next);
  };
}

function getUserInfoDecorator(func) {
  return (req, res, next) => {
    const userId = req.user._id;
    func(userId, res, next);
  };
}

module.exports.getUserById = getUserByIdDecorator(getUser);
module.exports.getUserInfo = getUserInfoDecorator(getUser);
