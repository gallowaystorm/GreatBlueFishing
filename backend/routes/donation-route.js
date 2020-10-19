const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const DonationController = require('../controller/donation-controller');

router.post('', checkAuth, extractFile, DonationController.addDonationCompany);

module.exports = router;