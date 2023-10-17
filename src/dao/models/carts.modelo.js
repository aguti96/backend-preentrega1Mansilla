const mongoose = require('mongoose');

const cartProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema({
  products: [cartProductSchema],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
