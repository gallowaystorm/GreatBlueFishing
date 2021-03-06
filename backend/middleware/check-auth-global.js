const jwt = require('jsonwebtoken');

//for checking if logged in when making request
module.exports = (req, res, next) => {
    //try to catch error if possible (error happens if no token)
    try {
        //pull token from header
        const token = req.headers.authorization
        //assign value to header and split on white space and the token is the 1st index because 'bearer' will be the first part
        .split(' ')[1];
        //verify token with same secret used to make it (will throw error if token is not verified or not correct)
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        //since this is a middleware, every middleware following will get this piece of information allowing us to grab it in the api route
        req.userData = { email: decodedToken.email,  userId: decodedToken.userId };
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "You need to be logged in to perform this action!"
        });
    }
}