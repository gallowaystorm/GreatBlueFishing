const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-global');
const extractFile = require('../middleware/multer');
const DonationController = require('../controller/donation-controller');

router.post('', checkAuth, extractFile, DonationController.addDonationCompany);

router.get('', DonationController.getAllDonationCompanies);

router.delete('/:id', checkAuth, DonationController.deleteDonationCompany);

router.get('/:id', checkAuth, DonationController.getSingleDonationCompany);

router.put('/:id', checkAuth, extractFile, DonationController.updateSingleDonationCompany);

module.exports = router;