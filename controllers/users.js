const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');
const { getUserInfo, getUserById } = require('../utils/findUser');
const { updateProfile, updateAvatar } = require('../utils/updateUserInfo');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  getUserById(req, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

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
      else if (err instanceof mongoose.Error.ValidationError) next(new BadRequestError('Переданы некорректные данные в метод создания пользователя'));
      else next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  updateProfile(req, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  updateAvatar(req, res, next);
};

module.exports.getUserInfo = (req, res, next) => {
  getUserInfo(req, res, next);
};
