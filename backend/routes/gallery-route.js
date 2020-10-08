const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const GalleryController = require('../controller/gallery-controller');

router.post('', checkAuth, extractFile, GalleryController.addGalleryImage);

//export all routes
module.exports = router;