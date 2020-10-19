
const DonationCompany = require('../models/donation-company-model');

exports.addDonationCompany = (req, res, next) => {
    //get image url
    const url = req.protocol + '://' + req.get('host');
    const donationCompany = new DonationCompany({ 
        name: req.body.companyName,
        imagePath: url + '/images/' + req.file.filename,
        description: req.body.description,
        companyAddress: {
            streetAddress: req.body.addressLineOne,
            addressLineOne: req.body.addressLineTwo,
            city: req.body.city,
            state: req.body.state,
            postal: parseFloat(req.body.postal, 10)
        },
        companyWebsite: req.body.companyWebsite
    });
    //saves to database and get result back of save
    donationCompany.save().then(createdDonationCompany => {
        console.log(createdDonationCompany)
        //sends status and then sends back a message and the id of post that was saved
        res.status(201).json({
            message: 'Gallery image added successfully',
            donationCompany: {
                ...createdDonationCompany,
                id: createdDonationCompany._id
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Creating a donation company failed!"
        });
    });
}