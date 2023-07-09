const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate("owner")
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCards = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === "ValidationError") return res.status(400).send({ message: "Переданы некорректные данные в метод создания карточки" });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) return res.status(404).send({ message: "Карточка с таким id не найдена" });
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") return res.status(400).send({ message: "Переданы некорректные данные в метод удаления карточки" });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.putLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: "Карточка с таким id не найдена" });
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") return res.status(400).send({ message: "Переданы некорректные данные в метод доабвления лайка карточки" });
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true, runValidators: true })
    .then((card) => {
      if (!card) return res.status(404).send({ message: "Карточка с таким id не найдена" });
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === "CastError") return res.status(400).send({ message: "Переданы некорректные данные в метод удаления лайка карточки" });
      return res.status(500).send({ message: err.message });
    });
};
