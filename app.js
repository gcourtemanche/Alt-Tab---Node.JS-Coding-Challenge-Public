'use strict';

let express = require('express');
let app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/User');

const baseURL = '/api';
const mongoURL = 'mongodb://127.0.0.1/AltTab';

app.use(bodyParser.json());

app.post(baseURL + '/register', function(req, res) {
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

app.post(baseURL + '/login', function(req, res) {
  const { email, password } = req.body;

  User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(400).send();
    }

    return res.status(200).send({ token: user._id });
  });
});

app.get(baseURL + '/profile', function(req, res) {
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

mongoose.connect(mongoURL);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = app;
