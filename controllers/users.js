const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === "CastError") return res.status(404).send({ message: "Пользователь не найден" });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") return res.status(400).send({ message: "Переданы некорректные данные в метод создания пользователя" });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  if (name || about) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === "ValidationError") return res.status(400).send({ message: "Переданы некорректные данные в метод обновления профиля пользователя" });
        return res.status(500).send({ message: err.message });
      });
  } else res.status(400).send({ message: "Переданы некорректные данные в метод обновления профиля пользователя" });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (avatar) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === "ValidationError") return res.status(400).send({ message: "Переданы некорректные данные в метод обновления аватара пользователя" });
        return res.status(500).send({ message: err.message });
      });
  } else res.status(400).send({ message: "Переданы некорректные данные в метод обновления аватара пользователя" });
};
