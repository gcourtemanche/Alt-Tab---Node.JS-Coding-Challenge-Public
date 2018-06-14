const jwt = require('jsonwebtoken');
const debug = require('debug');

const config = require('../config');
const log = (message) => debug(config.appNamespace + 'middlewares:verifyJWT')(message);

module.exports = function(req, res, next) {
  const secret = process.env.JWT_SECRET;
  let token = req.headers.authorization;

  if (!token || token.slice(0,6) !== 'Bearer') {
    log('Invalid token');
    return res.status(401).send();
  }
  token =  token.slice(7);

  jwt.verify(token, secret, (err, decodedPayload) => {
    if (err) {
      log('Authentification failed');
      return res.status(400).send();
    }

    req.userId = decodedPayload.userId;
    next();
  });
};
