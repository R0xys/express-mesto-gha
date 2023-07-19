const validator = require('validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные в метод получения пользователя'));
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!validator.isEmail(email)) next(new BadRequestError('Переданы некорректные данные в метод создания пользователя'));
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) next(new ConflictError('Пользователь с таким email уже существует'));
      if (err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные в метод создания пользователя'));
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные в метод обновления профиля пользователя'));
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError('Переданы некорректные данные в метод обновления аватара пользователя'));
      next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким id не найден');
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные в метод получения пользователя'));
      next(err);
    });
};
