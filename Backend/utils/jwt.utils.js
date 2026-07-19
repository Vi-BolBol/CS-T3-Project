const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt.config");

function signToken(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

function generateToken(user) {
  return jwt.sign({
    id: user._id,
    role: user.role,
    email: user.email
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
}


module.exports = { signToken, verifyToken , generateToken };