const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String },
  category: { type: String },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', cartItemSchema);
