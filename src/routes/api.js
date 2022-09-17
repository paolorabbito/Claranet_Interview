const express = require('express');
const { authAdminToken, authUserToken } = require('../middleware/auth');
const apiController = require('../controller/apiController');
const router = express.Router();

//const apicache = require('apicache');
//let cache = apicache.middleware;

router.get('/stats/products', authAdminToken, apiController.getProductsStats);
router.get('/stats/products/:id/avg', authAdminToken, apiController.getProductAverage);
router.get('/user/info', authUserToken, apiController.getUserInfo);

module.exports =  router;