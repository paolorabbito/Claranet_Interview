const express = require('express');
const { authAdminToken, authUserToken } = require('../middleware/auth');
const apiController = require('../controller/apiController');
const router = express.Router();

//const apicache = require('apicache');
//let cache = apicache.middleware;

router.get('/stats/product', authAdminToken, apiController.getStatsProduct);
router.get('/user/info', authUserToken, apiController.getUserInfo);

module.exports =  router;