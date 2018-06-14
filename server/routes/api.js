const express = require('express');
const router = express.Router();
const debug = require('debug');

const User = require('../models/User');
const verifyJWT = require('../middlewares/verifyJWT');
const signJWT = require('../helpers/signJWT');
const config = require('../config');

const currentNamespace = config.appNamespace + 'api:';

// POST /api/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  const log = (message) => debug(currentNamespace + 'register')(`${message}; email: ${email}, name: ${name}`);

  User.create({ email, password, name }, (err, user) => {
    if (err) {
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

    const token = signJWT(user._id);

    return res.status(201).send({ token: token });
  });
});

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const log = (message) => debug(currentNamespace + 'login')(`${message}; email: ${email}`);

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      log(err);
      return res.status(400).send();
    }

    const token = signJWT(user._id);

    return res.status(200).send({ token: token });
  });
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
