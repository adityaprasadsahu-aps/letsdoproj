const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// --- Cart Schema — each item belongs to a specific user ---
const cartSchema = new mongoose.Schema({
  userId:   { type: String, required: true },   // MongoDB _id of the logged-in user
  id:       { type: Number, required: true },
  name:     { type: String, required: true },
  series:   { type: String, required: true },
  price:    { type: Number, required: true },
  image:    { type: String, default: '' },
  quantity: { type: Number, default: 1, min: 1 }
});

const Cart = mongoose.model('Cart', cartSchema);

// GET /api/cart?userId=xxx — fetch only THIS user's cart
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success: false, message: 'userId is required.' });
  try {
    const items = await Cart.find({ userId });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/cart — add item (requires userId in body)
router.post('/', async (req, res) => {
  try {
    const { userId, id, name, series, price, image } = req.body;

    if (!userId || !id || !name || !series || price === undefined) {
      return res.status(400).json({ success: false, message: 'userId, id, name, series, and price are required.' });
    }

    const existing = await Cart.findOne({ userId, id: Number(id), series });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ success: true, message: 'Quantity incremented.', data: existing });
    }

    const newItem = new Cart({ userId, id: Number(id), name, series, price, image: image || '', quantity: 1 });
    await newItem.save();
    res.status(201).json({ success: true, message: 'Item added to cart.', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/cart/:id — update quantity (requires userId + series in body)
router.put('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { userId, quantity, series } = req.body;

    if (!userId) return res.status(400).json({ success: false, message: 'userId is required.' });
    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number.' });
    }

    const item = await Cart.findOne({ userId, id: itemId, series });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    item.quantity = quantity;
    await item.save();
    res.json({ success: true, message: 'Quantity updated.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart/:id?userId=xxx&series=xxx — remove one item
router.delete('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { userId, series } = req.query;

    if (!userId) return res.status(400).json({ success: false, message: 'userId is required.' });

    const removed = await Cart.findOneAndDelete({ userId, id: itemId, series });
    if (!removed) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    res.json({ success: true, message: 'Item removed from cart.', data: removed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart?userId=xxx — clear only THIS user's cart
router.delete('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ success: false, message: 'userId is required.' });
  try {
    await Cart.deleteMany({ userId });
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
