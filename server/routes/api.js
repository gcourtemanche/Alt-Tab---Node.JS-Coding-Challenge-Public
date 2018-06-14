const express = require('express');
const router = express.Router();
const debug = require('debug');
var bcrypt = require('bcrypt');

const User = require('../models/User');
const verifyJWT = require('../middlewares/verifyJWT');
const signJWT = require('../helpers/signJWT');
const config = require('../config');

const currentNamespace = config.appNamespace + 'api:';

// POST /api/register
router.post('/register', async(req, res) => {
  const { email, password, name } = req.body;
  const log = (message) => debug(currentNamespace + 'register')(`${message}; email: ${email}, name: ${name}`);

  if (!password) {
    log('No password');
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
});

// POST /api/login
router.post('/login', async(req, res) => {
  const { email, password } = req.body;
  const log = (message) => debug(currentNamespace + 'login')(`${message}; email: ${email}`);

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

});

// GET /api/profile
router.get('/profile', verifyJWT, (req, res) => {
  const log = (message) => debug(currentNamespace + 'profile')(`${message}; user id: ${req.userId}`);

  User.findById(req.userId, (err, user) => {
    if (err) {
      log(err);
      return res.status(400).send();
    }

    return res.status(200).send(user);
  });
});

module.exports = router;
