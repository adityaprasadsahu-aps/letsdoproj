const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  itemName: String,
  discountPercentage: { type: Number, required: true, min: 1, max: 100 },
  endTime: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discount', discountSchema);
