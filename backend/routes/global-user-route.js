const express = require('express');
const GlobalUserController = require('../controller/global-user.controller');

const router = express.Router();

//for login
router.post('/login', GlobalUserController.globalUserLogin);

module.exports = router;