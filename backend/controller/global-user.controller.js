const User = require('../models/user-model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//login user
exports.globalUserLogin =  (req, res, next) => {
    //validate credentials are correct
    User.findOne({ email: req.body.email })
        .then(user => {
            //check if user exists
            if (!user) {
                return res.status(401).json({
                    message: "Auth not successful!"
                });
            }
            //so user can be used anywhere
            fetchedUser = user;
            //now check password if user exists
                //compare input to encrypted value
            return bcrypt.compare(req.body.password, user.password)
                .then(result => {
                    //check if result is true (password matches)
                    if (!result) {
                        return res.status(401).json({
                            message: "Incorrect Password."
                        });
                    }
                    //if password exists we make a JSON web token (using jsonwebtoken package)
                        //THE SECRET SHOULD BE LONGER!!!!!!
                    const token = jwt.sign( {email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, { expiresIn: '1h'});
                    res.status(200).json({
                        token: token,
                        //in seconds
                        expiresIn: 3600,
                        message: 'Authentication scuccessful!',
                        userId: fetchedUser._id
                    })
                })
                //catch for errors
                .catch(err => {
                    console.log(err);
                    return res.status(401).json({
                        message: "Invalid authentication credentials!"
                    });
                });
        });
};