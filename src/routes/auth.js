const express = require('express');
const authController = require('../controller/authController');
const { authToken } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', authToken(2) ,authController.signup); 
router.post('/login', authController.login);
router.get('/refresh', authController.refresh);

module.exports =  router;