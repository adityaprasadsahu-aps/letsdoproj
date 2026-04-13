const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  saleId: { type: String, default: 'limited-time-sale', unique: true },
  title: { type: String, default: 'Limited Time Sale' },
  endTime: { type: Date, required: true },
  discount: { type: Number, default: 40 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sale', saleSchema);
