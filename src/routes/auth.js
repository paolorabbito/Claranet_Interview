const express = require('express');
const authController = require('../controller/authController');
const { authOperatorToken } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', authOperatorToken ,authController.signup); 
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

module.exports =  router;