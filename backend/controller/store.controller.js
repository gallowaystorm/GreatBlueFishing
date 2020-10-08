
const Order = require('../models/order-model');
const OrderDetails = require('../models/order-details-model');
const User = require('../models/user-model');
const stripe = require('stripe')('sk_test_51HX4yUDEnGCSjwlXTwF3zHZ9UDmJ1KyicNOqdii6T4PyL7CQc8UqcnZ2TWJ9rnHxlY1oedwQgnVjsPYWkfNbm3Bn00N7JwRJbt')

exports.testStripe = (req, res, next) => {
    
}

exports.placeOrder = async (req, res, next) => {
    const nameInformation = req.body.nameInformation;
    const shippingInformation = req.body.shippingInformation;
    const billingInformation = req.body.billingInformation;
    const cartData = req.body.cartData;
    const userId = cartData[0].userId;
    const fullName = nameInformation.firstName + ' ' + nameInformation.lastName;
    const cardExpiration = billingInformation.expiration.split('/');
    const expirationMonth = cardExpiration[0];
    const expirationYear = '20' + cardExpiration[1]; 
    redirectURL = null;
    //create total
    let total = 0;
    for (let i = 0; i < cartData.length; i++){
        total = parseFloat((cartData[i].price * cartData[i].quantity), 10) + total;
    }
    //get user email
    let userEmail = '';
    await User.findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Could not find user in database. Make sure you have an account and try again"
                });
            }
            userEmail = user.email;
        }).catch(error => {
            return res.status(500).json({
                message: "Something went wrong with the server. Please try again."
            });
        })
    //start of new stripe api
    const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
            number: billingInformation.cardNumber,
            exp_month: expirationMonth,
            exp_year: expirationYear,
            cvc: billingInformation.securityCode
        },
        billing_details: {
            address: {
                city: billingInformation.billingCity,
                line1: billingInformation.billingStreetAddress,
                line2: billingInformation.billingAddressLineTwo,
                postal_code: billingInformation.billingPostal,
                state: billingInformation.billingState
            },
            name: billingInformation.nameOnCard,
            email: userEmail
        }
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    });

    //create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: total * 100,
        currency: 'usd',
        payment_method: paymentMethod.id,
        confirm: true,
        receipt_email: userEmail,
        shipping: {
            address: {
                line1: shippingInformation.shippingStreetAddress,
                line2: shippingInformation.shippingAddressLineTwo,
                city: shippingInformation.shippingCity,
                state: shippingInformation.shippingState,
                postal_code: shippingInformation.shippingPostal
            },
            name: fullName
        }
    }).then(createdPaymentIntent => {
        //for if card needs additional steps for confirmation
        //TODO: need to look into how to only create order in database once this authentication has been complete (probably through search of payment intent)
        if (createdPaymentIntent.status === 'requires_action') {
            //set url for url where authentication is needed
            redirectURL = createdPaymentIntent.next_action.use_stripe_sdk.stripe_js;
        } 

        //create order for Great Blue Database
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
            userId: userId,
            stripeId: createdPaymentIntent.id
        });

        //TODO: Keep in mind that you also should use a transaction here because if one of order details fails to be created then an order and previously created order details still stay in the DB.
        //TODO: look into promise.all for this

        //save to database
        order.save()
        .then(createdOrder => {
            //create order details
            for (let i = 0; i < cartData.length; i++){
                const total = parseFloat((cartData[i].price * cartData[i].quantity), 10);
                const orderDetails = new OrderDetails({
                    productId: cartData[i].productId,
                    quantity: cartData[i].quantity,
                    total: total,
                    orderId: createdOrder._id
                });
                orderDetails.save().catch(error => {
                    return res.status(500).json({
                        message: "Something went wrong when saving your order details to the database."
                    });
                })
            }
            //TODO: look into promise.all for this
            return res.status(201).json({
                message: 'Order created successfully',
                orderId: createdOrder._id,
                redirectURL: redirectURL
            });
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                message: "Something went wrong when saving your order to the database."
            });
        });

    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    });
}