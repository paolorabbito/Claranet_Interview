const express = require('express');
const { authToken } = require('../middleware/auth');
const apiController = require('../controller/apiController');
const router = express.Router();


router.get('/stats/products', authToken(1), apiController.getProductsStats);
router.get('/stats/products/:id/avg', authToken(1), apiController.getProductAverage);
router.get('/user/info', authToken(3), apiController.getUserInfo);
router.delete('/user/:id', authToken(3), apiController.deleteUserInfo);

module.exports =  router;