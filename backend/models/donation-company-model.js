const mongoose = require('mongoose');

const donationCompanySchema = mongoose.Schema({
    name: { type: String, required: true },
    imagePath: { type: String, required: true },
    description: { type: String, required: true },
    companyAddress: {
        streetAddress: { type: String, required: true },
        addressLineTwo: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal: { type: Number, required: true } 
    },
    companyWebsite: { type: String } 
})


module.exports = mongoose.model('DonationCompany', donationCompanySchema);