
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
            addressLineTwo: req.body.addressLineTwo,
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

exports.getAllDonationCompanies = (req, res, next) => {
    DonationCompany.find()
        .then(donationCompanies => {
            res.status(200).json({
                message: "Donation companies fetched successfully!",
                donationCompanies: donationCompanies
            });
        })
        //to catch technical issues
        .catch( error => {
            res.status(500).json({
                message: "Fetching donation companies failed!"
            });
        });
}

exports.getSingleDonationCompany = (req, res, next) => {
  DonationCompany.findById(req.params.id).then( donationCompany => {
      //check if exist
      if (donationCompany) {
          res.status(200).json(donationCompany)
      } else {
          res.status(404).json({
            message: 'Donation company not found!'
          })
      }
  })
  //to catch technical issues
  .catch( error => {
      res.status(500).json({
          message: "Fetching donation company failed!"
      });
  });
};

exports.deleteDonationCompany = (req, res, next) => {
    //params pulls id from url
    DonationCompany.deleteOne( {_id: req.params.id})
    //to get result
    .then(result => {
        //for error catching
        if (result.n > 0){
            res.status(200).json({message: 'Deletion Successful'});
        } else {
            res.status(401).json({message: 'Not Authroized!'});
        }
    })
    //to catch technical issues
    .catch( error => {
        res.status(500).json({
            message: "Deleting donation company failed!"
        });
    });
};

exports.updateSingleDonationCompany = (req, res, next) => {
    console.log
    let donationCompany = new DonationCompany();
    //check if string or req already has the path
    let imagePath = req.body.imagePath;
    if (req.file) {
        //set image path to url of image
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename; 
        //creates new donation company if image is uploaded
        donationCompany = { 
            _id: req.params.id,
            name: req.body.companyName,
            imagePath: imagePath,
            description: req.body.description,
            companyAddress: {
                streetAddress: req.body.addressLineOne,
                addressLineTwo: req.body.addressLineTwo,
                city: req.body.city,
                state: req.body.state,
                postal: parseFloat(req.body.postal, 10)
            },
            companyWebsite: req.body.companyWebsite
        };
    } else {
        //creates new donation company if image is not changed
        donationCompany = { 
            _id: req.params.id,
            name: req.body.companyName,
            imagePath: imagePath,
            description: req.body.description,
            companyAddress: {
                streetAddress: req.body.companyAddress.addressLineOne,
                addressLineTwo: req.body.companyAddress.addressLineTwo,
                city: req.body.companyAddress.city,
                state: req.body.companyAddress.state,
                postal: parseFloat(req.body.companyAddress.postal, 10)
            },
            companyWebsite: req.body.companyWebsite
        };
    }
    
    //update gallery image based off id passed in through browser
    //creator checks to see if the id of one updating matches the one creating
    DonationCompany.updateOne( {_id: req.params.id }, donationCompany )
        //if post is successfully updated
        .then( result => {
            //for error catching
            if (result.n > 0){
                res.status(200).json({message: 'Update Successful'});
            } else {
                res.status(401).json({message: 'Not Authroized!'});
            }
        })
        //to catch tecnical errors as well
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: "Couldn't update donation company!"
            });
        });  
};