const env = require("./env.config");

module.exports = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};