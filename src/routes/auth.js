const express = require('express');
require('dotenv').config();
const authController = require('../controller/authController');
const router = express.Router();
//const apicache = require('apicache');

//Caching requests for performance
//let cache = apicache.middleware;

router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);
//router.get('/auth/refresh', authController.refresh);

module.exports =  router;