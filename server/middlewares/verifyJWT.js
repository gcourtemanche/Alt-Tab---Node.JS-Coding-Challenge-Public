const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  let token = req.headers.authorization;
  if (!token || token.slice(0,6) !== 'Bearer') return res.status(401).send();

  token =  token.slice(7);

  jwt.verify(token, process.env.JWT_SECRET, function(err, decodedPayload) {
    if (err) return res.status(400).send();

    req.userId = decodedPayload.userId;
    next();
  });
};
