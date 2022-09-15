const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();

router.post('/signup', authController.signup); //Utilizzata da me solo per poter inserire degli utenti di test nel database
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

module.exports =  router;