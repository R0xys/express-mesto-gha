const { celebrate, Joi } = require('celebrate');

module.exports.getUserParamsValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
});

module.exports.updateProfileBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.updateAvatarBodyValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(www.)?([\w\-._~:/?#[\]@!$&'()*+,;=])+$/),
  }),
});

module.exports.createCardsBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri().regex(/^https?:\/\/(www.)?([\w\-._~:/?#[\]@!$&'()*+,;=])+$/),
  }),
});

module.exports.deleteCardParamsValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }),
});

module.exports.putLikeParamsValdator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }),
});

module.exports.deleteLikeParamsValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24),
  }),
});

module.exports.loginBodyValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.createUserBodyValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(/^https?:\/\/(www.)?([\w\-._~:/?#[\]@!$&'()*+,;=])+$/),
  }),
});
