const jwt = require('jsonwebtoken');

const debug = require('../helpers/initDebug')('middlewares:verifyJWT');

module.exports = function(req, res, next) {
  const secret = process.env.JWT_SECRET;
  let token = req.headers.authorization;

  if (!token || token.slice(0,6) !== 'Bearer') {
    debug('Invalid token');
    return res.status(401).send();
  }
  token =  token.slice(7);

  jwt.verify(token, secret, (err, decodedPayload) => {
    if (err) {
      debug('Authentication failed');
      return res.status(400).send();
    }

    req.userId = decodedPayload.userId;
    next();
  });
};
