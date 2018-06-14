const bcrypt = require('bcrypt');

const debug = require('../../helpers/initDebug')('api:register');
const signJWT = require('../../helpers/signJWT');
const User = require('../../models/User');

// POST /api/register
module.exports = async(req, res) => {
  const { email, password, name } = req.body;
  const log = (message) => debug(`${message}; email: ${email}, name: ${name}`);

  if (!email || !password) {
    log('Missing password or email');
    return res.status(400).send();
  }

  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ email, password: hashPassword, name });

    const token = await signJWT(user._id);
    return res.status(201).send({ token: token });

  } catch (err) {
    if (err.name === 'MongoError' && err.message.includes('duplicate key error')) {
      log('Duplicate key error');
      return res.status(400).send();
    }

    if (err.name === 'ValidationError') {
      log(err.toString());
      return res.status(400).send();
    }

    log(err);
    return res.status(500).send();
  }
};
