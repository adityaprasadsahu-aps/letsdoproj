const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  series: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  quantity: { type: Number, default: 1, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model('CartItem', cartSchema);