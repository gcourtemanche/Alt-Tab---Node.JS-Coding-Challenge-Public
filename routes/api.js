const express = require('express');
const router = express.Router();

const User = require('../models/User');

// POST /api/register
router.post('/register', function(req, res) {
  const { email, password, name } = req.body;

  User.create({ email, password, name }, (err, user) => {
    if (err) {
      if (err.name === 'MongoError' && err.message.includes('duplicate key error')) return res.status(400).send();
      if (err.name === 'ValidationError') return res.status(400).send();
      console.error(err);
      return res.status(500).send();
    }

    return res.status(201).send({ token: user._id });
  });
});

// POST /api/login
router.post('/login', function(req, res) {
  const { email, password } = req.body;

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).send();
    }

    return res.status(200).send({ token: user._id });
  });
});

// GET /api/profile
router.get('/profile', function(req, res) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send();

  const id = token.slice(7);
  User.findById(id, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).send();
    }

    return res.status(200).send(user);
  });
});

module.exports = router;
