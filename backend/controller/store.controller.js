
const Order = require('../models/order-model');
const OrderDetails = require('../models/order-details-model');
const User = require('../models/user-model')
const bcrypt = require('bcrypt');
const stripe = require('stripe')('sk_test_51HX4yUDEnGCSjwlXTwF3zHZ9UDmJ1KyicNOqdii6T4PyL7CQc8UqcnZ2TWJ9rnHxlY1oedwQgnVjsPYWkfNbm3Bn00N7JwRJbt')

exports.testStripe = (req, res, next) => {
    
}

exports.placeOrder = (req, res, next) => {
    const nameInformation = req.body.nameInformation;
    const shippingInformation = req.body.shippingInformation;
    const billingInformation = req.body.billingInformation;
    const cartData = req.body.cartData;
    const userId = cartData[0].userId;
    let userEmail = '';
    const fullName = nameInformation.firstName + ' ' + nameInformation.lastName;
    const cardExpiration = billingInformation.expiration.split('/');
    const expirationMonth = cardExpiration[0];
    const expirationYear = '20' + cardExpiration[1]; 
    //create total
    let total = 0;
    for (let i = 0; i < cartData.length; i++){
        total = parseFloat((cartData[i].price * cartData[i].quantity), 10) + total;
    }
    //get user email
    User.findOne({ _id: userId })
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
    //create token
    const token = stripe.tokens.create({
        card: {
          number: billingInformation.cardNumber,
          exp_month: expirationMonth,
          exp_year: expirationYear,
          name: billingInformation.nameOnCard,
          cvc: billingInformation.securityCode,
          address_line1: billingInformation.billingStreetAddress,
          address_line2: billingInformation.billingAddressLineTwo,
          address_city: billingInformation.billingCity,
          address_state: billingInformation.billingState,
          address_zip: billingInformation.billingPostal
        },
      }).then(createdToken => {
          console.log(createdToken)
        const charge = stripe.charges.create({
            amount: total * 100,
            currency: 'usd',
            receipt_email:  userEmail,
            source: createdToken.id,
            capture: true,
            shipping: {
                address: {
                    line1: shippingInformation.shippingStreetAddress,
                    line2: shippingInformation.shippingAddressLineTwo,
                    city: shippingInformation.shippingCity,
                    state: shippingInformation.shippingState,
                    postal_code: shippingInformation.shippingPostal
                },
                name: fullName
            },
        }).then(stripeCharge => {
            console.log(stripeCharge);
            //create order with corresponding stripe payment ID
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
                 userId: userId,
                 stripeId: stripeCharge.id 
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
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                message: error.raw.message
            });
        }); 
      }); 
}