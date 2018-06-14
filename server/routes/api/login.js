const bcrypt = require('bcrypt');

const debug = require('../../helpers/initDebug')('api:login');
const signJWT = require('../../helpers/signJWT');
const User = require('../../models/User');

// POST /api/login
module.exports = async(req, res) => {
  const { email, password } = req.body;
  const log = (message) => debug(`${message}; email: ${email}`);

  if (!password) {
    log('No password');
    return res.status(400).send();
  }

  try {
    const user = await User.findOne({ email });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token =  await signJWT(user._id);

      return res.status(200).send({ token: token });
    } else {
      log('Authentication failed');
      return res.status(401).send();
    }
  } catch (err) {
    log(err);
    return res.status(500).send();
  }
};
