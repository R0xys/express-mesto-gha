const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => next(new Error(err.message)));
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') next(new NotFoundError('Переданы некорректные данные в метод создания карточки'));
      next(new Error(err.message));
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findOneAndRemove({ owner: req.user._id, _id: cardId })
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена или карточка не ваша');
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные в метод удаления карточки'));
      next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные в метод доабвления лайка карточки'));
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError('Переданы некорректные данные в метод удаления лайка карточки'));
      next(err);
    });
};
