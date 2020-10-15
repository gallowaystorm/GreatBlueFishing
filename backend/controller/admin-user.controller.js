const AdminUser = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//to create admin user
exports.createAdminUser = (req, res, next) => {
    //encrypt password in database so we or anybody else cant see passwords
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const adminUser = new AdminUser({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            isAdmin: true
        });
        //save to database
        adminUser.save()
            .then(result => {
                res.status(201).json({
                    message: 'Admin was created!',
                    result: result
                });
            })
            //for error catching
            .catch(error => {
                res.status(500).json({
                    message: "Something went wrong when creating admin user!"
                });
            });
    });
};


//return if admin or not
exports.getIsAdmin = (req, res ,next) => {
    try {
        AdminUser.findOne({_id: req.body.id})
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                fetchedUser = user;
                const isAdmin = fetchedUser.isAdmin;
                if (isAdmin){
                    res.status(200).json({
                        message: 'User is an admin',
                        isAdmin: true
                    });
                } else {
                    res.status(200).json({
                        message: 'User is not an admin',
                        isAdmin: false
                    });
                }
            });
    } catch(err){
        res.status(500).json({
            message: "Something went wrong when fetching user."
        })
    }
};

//find all admin users

exports.getAllAdminUsers = (req, res, next) => {
    AdminUser.find({ isAdmin: true })
        .then( adminUsers => {
            res.status(200).json({
                message: 'Fetched admin users successfully!',
                adminUsers: adminUsers
            });
        }).catch( error => {
            res.status(500).json({
                message: "Fetching admin users failed!"
            });
        });
};

//delete admin user
exports.deleteAdminUser = (req, res, next) => {
    //params pulls id from url
    AdminUser.deleteOne( {_id: req.params.id})
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
                message: "Deleting admin user failed!"
            });
        });
};