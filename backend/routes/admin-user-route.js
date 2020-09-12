const express = require('express');
const AdminUserController = require('../controller/admin-user.controller');

const router = express.Router();

//for finding if admin
router.post('/find', AdminUserController.getIsAdmin);

//finding all admin users
router.get('/find', AdminUserController.getAllAdminUsers)

//create admin user
router.post('/registration', AdminUserController.createAdminUser);

module.exports = router;