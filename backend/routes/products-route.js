const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const productController = require('../controller/product.controller')

router.post('', checkAuth, extractFile, productController.addProduct);

router.get('', productController.getAllProducts);

router.get('/:id', checkAuth, productController.getSingleProduct);

router.put('/:id', checkAuth, extractFile, productController.updateSingleProduct);

router.delete('/:id', checkAuth, productController.deleteSingleProduct);

//export all routes
module.exports = router;