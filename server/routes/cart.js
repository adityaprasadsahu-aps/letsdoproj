const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// --- Cart Schema & Model (collection: "carts" in mydb) ---
const cartSchema = new mongoose.Schema({
  id:       { type: Number, required: true },
  name:     { type: String, required: true },
  series:   { type: String, required: true },
  price:    { type: Number, required: true },
  image:    { type: String, default: '' },
  quantity: { type: Number, default: 1, min: 1 }
});

const Cart = mongoose.model('Cart', cartSchema);

// GET /api/cart — Fetch all cart items
router.get('/', async (req, res) => {
  try {
    const items = await Cart.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// POST /api/cart — Add item or increment quantity
router.post('/', async (req, res) => {
  try {
    const { id, name, series, price, image } = req.body;

    if (!id || !name || !series || price === undefined) {
      return res.status(400).json({ success: false, message: 'id, name, series, and price are required.' });
    }

    const existing = await Cart.findOne({ id: Number(id), series });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ success: true, message: 'Quantity incremented.', data: existing });
    }

    const newItem = new Cart({ id: Number(id), name, series, price, image: image || '', quantity: 1 });
    await newItem.save();
    res.status(201).json({ success: true, message: 'Item added to cart.', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// PUT /api/cart/:id — Update quantity
router.put('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { quantity, series } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number.' });
    }

    const item = await Cart.findOne({ id: itemId, series });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    item.quantity = quantity;
    await item.save();
    res.json({ success: true, message: 'Quantity updated.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart/:id — Remove a specific item
router.delete('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { series } = req.query;

    const removed = await Cart.findOneAndDelete({ id: itemId, series });

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    res.json({ success: true, message: 'Item removed from cart.', data: removed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// DELETE /api/cart — Clear entire cart
router.delete('/', async (req, res) => {
  try {
    await Cart.deleteMany({});
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
