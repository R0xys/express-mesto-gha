const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');

function findCardAndUpdate(cardId, option, errMessage, res, next) {
  Card.findByIdAndUpdate(
    cardId,
    option,
    { new: true },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Карточка с таким id не найдена');
      return res.send({ card });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) next(new BadRequestError(errMessage));
      else next(err);
    });
}

function putLikeDecorator(func) {
  return (req, res, next) => {
    const { cardId } = req.params;
    const option = { $addToSet: { likes: req.user._id } };
    const errMessage = 'Переданы некорректные данные в метод доабвления лайка карточки';
    func(cardId, option, errMessage, res, next);
  };
}

function deleteLikeDecorator(func) {
  return (req, res, next) => {
    const { cardId } = req.params;
    const option = { $pull: { likes: req.user._id } };
    const errMessage = 'Переданы некорректные данные в метод удаления лайка карточки';
    func(cardId, option, errMessage, res, next);
  };
}

module.exports.putLike = putLikeDecorator(findCardAndUpdate);
module.exports.deleteLike = deleteLikeDecorator(findCardAndUpdate);
