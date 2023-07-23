const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', require('../requestValidation').getUserParamsValidator, getUser);
router.patch('/me', require('../requestValidation').updateProfileBodyValidator, updateProfile);
router.patch('/me/avatar', require('../requestValidation').updateAvatarBodyValidator, updateAvatar);

module.exports = router;
