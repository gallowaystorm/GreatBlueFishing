const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const GalleryController = require('../controller/gallery-controller');

router.post('', checkAuth, extractFile, GalleryController.addGalleryImage);

router.get('', GalleryController.getAllGalleryImages);

router.delete('/:id', checkAuth, GalleryController.deleteGalleryImage);

router.get('/:id', checkAuth, GalleryController.getSingleGalleryImage);

router.put('/:id', checkAuth, extractFile, GalleryController.updateSingleImage);

//export all routes
module.exports = router;