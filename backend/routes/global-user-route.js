const express = require('express');
const GlobalUserController = require('../controller/global-user.conroller');

const router = express.Router();

//for signup
router.post('/login', GlobalUserController.globalUserLogin);

module.exports = router;