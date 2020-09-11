const express = require('express');
const CustomerUserController = require('../controller/customer-user-controller');

const router = express.Router();

//for signup
router.post('/registration', CustomerUserController.createCustomerUser);

module.exports = router;