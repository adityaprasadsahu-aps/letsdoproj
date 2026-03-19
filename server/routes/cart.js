const express = require('express');
const router = express.Router();
const CartItem = require('../models/Cart');

// GET all cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching cart items.', error: err.message });
  }
});

// POST add item to cart
router.post('/', async (req, res) => {
  try {
    const { id, name, series, price, image } = req.body;

    if (!id || !name || !series || price === undefined) {
      return res.status(400).json({ success: false, message: 'id, name, series, and price are required.' });
    }

    // Check if item already exists
    const existing = await CartItem.findOne({ id, series });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json({ success: true, message: 'Quantity incremented.', data: existing });
    }

    // Create new item
    const newItem = new CartItem({ id, name, series, price, image: image || '', quantity: 1 });
    await newItem.save();
    res.status(201).json({ success: true, message: 'Item added to cart.', data: newItem });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding item to cart.', error: err.message });
  }
});

// PUT update item quantity
router.put('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { quantity, series } = req.body;

    if (quantity === undefined || quantity < 1) {
      return res.status(400).json({ success: false, message: 'quantity must be a positive number.' });
    }

    const item = await CartItem.findOne({ id: itemId, series });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    item.quantity = quantity;
    await item.save();
    res.json({ success: true, message: 'Quantity updated.', data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating item.', error: err.message });
  }
});

// DELETE remove specific item from cart
router.delete('/:id', async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const { series } = req.query;

    const removed = await CartItem.findOneAndDelete({ id: itemId, series });

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    res.json({ success: true, message: 'Item removed from cart.', data: removed });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing item.', error: err.message });
  }
});

// DELETE clear entire cart
router.delete('/', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error clearing cart.', error: err.message });
  }
});

module.exports = router;
