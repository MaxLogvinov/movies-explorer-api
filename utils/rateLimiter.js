const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 2 * 1000,
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiter;
