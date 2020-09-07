const CustomerUser = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createCustomerUser = (req, res, next) => {
    //encrypt password in database so we or anybody else cant see passwords
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const customerUser = new CustomerUser({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isAdmin: false
        });
        //save to database
        customerUser.save()
            .then(result => {
                res.status(201).json({
                    message: 'Customer was created!',
                    result: result
                });
            })
            //for error catching
            .catch(error => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    });
};
