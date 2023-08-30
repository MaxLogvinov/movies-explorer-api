const router = require('express').Router();
const { getUserInfo, updateUser } = require('../controllers/users');
const { updateUserInfoValidation } = require('../utils/validation');

router.get('/me', getUserInfo);
router.patch('/me', updateUserInfoValidation, updateUser);

module.exports = router;
