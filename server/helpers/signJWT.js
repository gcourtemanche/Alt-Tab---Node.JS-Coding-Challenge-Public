const jwt = require('jsonwebtoken');

module.exports = function(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};
