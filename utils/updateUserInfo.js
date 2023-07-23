const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

function findUserAndUpdate(userId, data, res, next) {
  User.findByIdAndUpdate(userId, data, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) next(new BadRequestError('Переданы некорректные данные в метод обновления профиля пользователя'));
      else next(err);
    });
}

function updateProfileDecorator(func) {
  return (req, res, next) => {
    const { name, about } = req.body;
    func(req.user._id, { name, about }, res, next);
  };
}

function updateAvatarDecorator(func) {
  return (req, res, next) => {
    const { avatar } = req.body;
    func(req.user._id, { avatar }, res, next);
  };
}

module.exports.updateProfile = updateProfileDecorator(findUserAndUpdate);
module.exports.updateAvatar = updateAvatarDecorator(findUserAndUpdate);
