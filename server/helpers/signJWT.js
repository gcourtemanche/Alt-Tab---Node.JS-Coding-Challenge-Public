const jwt = require('jsonwebtoken');

module.exports = function(userId) {
  return new Promise((resolve, reject) => {
    const options = { expiresIn: '24h' };
    const secret = process.env.JWT_SECRET;
    const payload = { userId };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};
