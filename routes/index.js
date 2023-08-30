const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const { login, createUser, signOut } = require('../controllers/users');
const {
  createUserValidation,
  loginValidation,
} = require('../utils/validation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', createUserValidation, createUser);
router.post('/signin', loginValidation, login);

router.use(auth);

router.post('/signout', signOut);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res) => {
  throw new NotFoundError('Данной страницы не существует');
});

module.exports = router;
