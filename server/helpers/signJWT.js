const jwt = require('jsonwebtoken');

module.exports = function(userId) {
  return new Promise((resolve, reject) => {
    const secret = process.env.JWT_SECRET;
    const payload = { userId };
    const options = { expiresIn: '24h' };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
