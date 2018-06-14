const express = require('express');
const router = express.Router();

const verifyJWT = require('../middlewares/verifyJWT');
const path = './api';

var register = require(path + '/register');
var login = require(path + '/login');
var profile = require(path + '/profile');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyJWT, profile);

module.exports = router;
