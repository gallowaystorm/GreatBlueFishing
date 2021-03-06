const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const storeController = require('../controller/store.controller');

//for placing order
router.post('/order', storeController.placeOrder, checkAuth);

module.exports = router;