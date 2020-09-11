const User = require('../models/user-model');

exports.getIsAdmin = (req, res ,next) => {
    try {
        User.findOne({_id: req.body.id})
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
                    res.status(401).json({
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