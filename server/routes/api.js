const express = require('express');
const router = express.Router();

const User = require('../models/User');
const verifyJWT = require('../middlewares/verifyJWT');
const signJWT = require('../helpers/signJWT');

// POST /api/register
router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  User.create({ email, password, name }, (err, user) => {
    if (err) {
      if (err.name === 'MongoError' && err.message.includes('duplicate key error')) return res.status(400).send();
      if (err.name === 'ValidationError') return res.status(400).send();
      console.error(err);
      return res.status(500).send();
    }

    const token = signJWT(user._id);

    return res.status(201).send({ token: token });
  });
});

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).send();
    }

    const token = signJWT(user._id);

    return res.status(200).send({ token: token });
  });
});

// GET /api/profile
router.get('/profile', verifyJWT, (req, res) => {

  User.findById(req.userId, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).send();
    }

    return res.status(200).send(user);
  });
});

module.exports = router;
