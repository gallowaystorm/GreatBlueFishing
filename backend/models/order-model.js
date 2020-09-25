const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    datePlaced: { type: Date, required: true },
    dateShipped: { type: Date, required: true },
    shippingAddress: {
        streetAddress: { type: String, required: true },
        addressLineTwo: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal: { type: Number, required: true }
    },
    paymentInformation : {
        cardType: { type: String, required: true },
        cardNumber: { type: Number, required: true },
        securityCode: { type: Number, required: true },
        expiration: { type: Date, required: true },
        nameOnCard: { type: String, required: true },
        billingAddress: {
            streetAddress: { type: String, required: true },
            addressLineTwo: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postal: { type: Number, required: true }
        }
    },
    userId: { type: String, required: true }
})


module.exports = mongoose.model('Order', orderSchema);