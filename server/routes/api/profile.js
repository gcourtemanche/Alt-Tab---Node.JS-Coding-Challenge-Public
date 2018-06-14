const debug = require('../../helpers/initDebug')('api:profile');
const User = require('../../models/User');

// POST /api/profile
module.exports = async(req, res) => {
  const log = (message) => debug(`${message}; user id: ${req.userId}`);

  User.findById(req.userId, (err, user) => {
    if (err) {
      log(err);
      return res.status(400).send();
    }

    return res.status(200).send(user);
  });
};
