const mongoose = require('mongoose');

const orderDetailsSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true  },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true  }
})

module.exports = mongoose.model('OrderDetails', orderDetailsSchema);
