const express = require('express');
const AdminUserController = require('../controller/admin-user.controller');

const router = express.Router();

//for finding if admin
router.post('/find', AdminUserController.getIsAdmin);

module.exports = router;