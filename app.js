'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const apiRouter = require('./server/routes/api');
const config = require('./server/config');

app.use(bodyParser.json());

app.use('/api', apiRouter);

// Acceptable for testing purposes
// For web server, wait until the connection is completed to start listening
mongoose.connect(config.mongoTestUrl);

module.exports = app;
