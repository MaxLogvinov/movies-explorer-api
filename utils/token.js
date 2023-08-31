const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;

function generateToken(payload) {
  return jwt.sign(
    { payload },
    NODE_ENV === 'production' ? SECRET_KEY : 'pipirka',
    { expiresIn: '7d' }
  );
}

function checkToken(token) {
  if (!token) {
    return false;
  }
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return false;
  }
}
module.exports = { generateToken, checkToken };
