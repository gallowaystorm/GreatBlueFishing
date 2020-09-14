const express = require('express');
const checkAuth = require('../middleware/check-auth-global');
const AdminUserController = require('../controller/admin-user.controller');

const router = express.Router();

//for finding if admin
router.post('/find', AdminUserController.getIsAdmin);

//finding all admin users
router.get('/find', AdminUserController.getAllAdminUsers)

//create admin user
router.post('/registration', checkAuth, AdminUserController.createAdminUser);

//delete admin user
router.delete('/:id', checkAuth, AdminUserController.deleteAdminUser)

module.exports = router;