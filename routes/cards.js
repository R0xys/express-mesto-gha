const router = require('express').Router();
const {
  getCards,
  createCards,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', require('../requestValidation').createCardsBodyValidator, createCards);
router.delete('/:cardId', require('../requestValidation').deleteCardParamsValidator, deleteCard);
router.put('/:cardId/likes', require('../requestValidation').putLikeParamsValdator, putLike);
router.delete('/:cardId/likes', require('../requestValidation').deleteLikeParamsValidator, deleteLike);

module.exports = router;
