
const Order = require('../models/order-model');
const OrderDetails = require('../models/order-details-model');
const bcrypt = require('bcrypt');

exports.placeOrder = (req, res, next) => {
    const nameInformation = req.body.nameInformation;
    const shippingInformation = req.body.shippingInformation;
    const billingInformation = req.body.billingInformation;
    const cartData = req.body.cartData;
    const userId = cartData[0].userId;

    //excrypt payment info
    const stringCardNumber = billingInformation.cardNumber.toString();
    bcrypt.hash(stringCardNumber, 10)
        .then(encryptedCardNumber => {
            const stringSecurityCode = billingInformation.securityCode.toString();
            bcrypt.hash(stringSecurityCode, 10)
                .then(encryptedSecurityCode => {
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
                            cardNumber: encryptedCardNumber,
                            securityCode: encryptedSecurityCode,
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
                        userId: userId
                    });

                    //TODO: Keep in mind that you also should use a transaction here because if one of order details fails to be created then an order and previously created order details still stay in the DB.
                    //TODO: look into promise.all for this

                    //save to database
                    try {
                        isCreated = true;
                        order.save()
                        .then(createdOrder => {
                            console.log(createdOrder);
                            //create order details
                            for (let i = 0; i < cartData.length; i++){
                                const total = parseFloat((cartData[i].price * cartData[i].quantity), 10);
                                const orderDetails = new OrderDetails({
                                    productId: cartData[i].productId,
                                    quantity: cartData[i].quantity,
                                    total: total,
                                    orderId: createdOrder._id
                                });
                                orderDetails.save().then(createdOrderDetails => {
                                    if (!createdOrderDetails) {
                                        isCreated = false;
                                    }
                                })
                            }
                            //TODO: look into promise.all for this
                            if (isCreated) {
                                return res.status(201).json({
                                    message: 'Order created successfully',
                                    orderId: createdOrder._id
                                });
                            } else {
                                return res.status(500).json({
                                    message: "Creating order details failed!"
                                });
                            }
                        })
                    } catch {
                        return res.status(500).json({
                                    message: "Creating order failed!"
                                });
                    }
            });
        });
}