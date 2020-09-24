const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    datePlaced: { type: Date, required: true },
    dateShipped: {type: Date, required: true },
})


module.exports = mongoose.model('Order', orderSchema);