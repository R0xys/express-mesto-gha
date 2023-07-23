const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) next(new NotFoundError('Переданы некорректные данные в метод создания карточки'));
      else next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      if (req.user._id !== card.owner.valueOf()) throw new ForbiddenError('Вы не можете удалять карточку другого пользователя');
      card.deleteOne()
        .then((requiredCard) => {
          res.send({ card: requiredCard });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequestError('Переданы некорректные данные в метод удаления карточки'));
      else next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      return res.send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequestError('Переданы некорректные данные в метод доабвления лайка карточки'));
      else next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      return res.send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequestError('Переданы некорректные данные в метод удаления лайка карточки'));
      else next(err);
    });
};
