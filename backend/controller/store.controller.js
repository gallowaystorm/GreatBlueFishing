
const Order = require('../models/order-model');
const OrderDetails = require('../models/order-details-model');
const bcrypt = require('bcrypt');

exports.placeOrder = (req, res, next) => {
    const nameInformation = req.body.nameInformation;
    const shippingInformation = req.body.shippingInformation;
    const billingInformation = req.body.billingInformation;
    //create order
    const Order = {
        firstName: nameInformation.firstName,
        lastName: nameInformation.lastName,
        datePlaced: 
    }
}