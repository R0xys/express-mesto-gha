const router = require('express').Router();
const NotFoundError = require('../errors/notFoundError');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Not found'));
});

module.exports = router;
