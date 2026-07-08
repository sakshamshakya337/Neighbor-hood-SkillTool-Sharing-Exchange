const rateLimit = require("express-rate-limit");

const authLimiter = (req, res, next) => next();

module.exports = { authLimiter };
