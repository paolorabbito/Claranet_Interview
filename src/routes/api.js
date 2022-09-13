const express = require('express');
const authAdminToken = require('../middleware/auth');
const apiController = require('../controller/apiController');
const router = express.Router();
//const apicache = require('apicache');

//Caching requests for performance
//let cache = apicache.middleware;

router.get('/', authAdminToken, apiController.getUserInfo);

module.exports =  router;