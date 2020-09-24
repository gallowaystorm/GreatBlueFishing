
const Order = require('../models/order-model');
const OrderDetails = require('../models/order-details-model');
const bcrypt = require('bcrypt');

exports.placeOrder = (req, res, next) => {
    const nameInformation = req.body.nameInformation;
    const shippingInformation = req.body.shippingInformation;
    const billingInformation = req.body.billingInformation;

    //for date of order
    var today = new Date();
    var orderDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    //create order
    const order = new Order({
        firstName: nameInformation.firstName,
        lastName: nameInformation.lastName,
        datePlaced: orderDate,
        dateShipped: orderDate,
        shippingAddress: {
            streetAddress: shippingInformation.shippingStreetAddress,
            addressLineTwo: shippingInformation.shippingAddressLineTwo,
            city: shippingInformation.shippingCity,
            state: shippingInformation.shippingState,
            postal: shippingInformation.shippingPostal
        },
        paymentInformation: {
            cardType: billingInformation.cardType,
            cardNumber: billingInformation.cardNumber,
            securityCode: billingInformation.securityCode,
            expiration: billingInformation.expiration,
            nameOnCard: billingInformation.nameOnCard,
            billingAddress: {
                streetAddress: billingInformation.billingStreetAddress,
                addressLineTwo: billingInformation.billingAddressLineTwo,
                city: billingInformation.billingCity,
                state: billingInformation.billingState,
                postal: billingInformation.billingPostal
            }
        },
        userId: 123,
        orderDetailsId: 123
    }) 

    //save order to database
    order.save()
        .then(createdOrder => {
            console.log(createdOrder);
        });
}