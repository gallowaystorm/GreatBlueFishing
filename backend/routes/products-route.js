const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const productController = require('../controller/product.controller')

router.post('', checkAuth, extractFile, productController.addProduct);

router.get('', productController.getAllProducts);

//export all routes
module.exports = router;