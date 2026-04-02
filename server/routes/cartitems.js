const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, itemId, name, price, quantity, image, category } = req.body;

    if (!userId || !itemId || !name || !price) {
      return res.status(400).json({
        success: false,
        message: 'UserId, itemId, name, and price are required'
      });
    }

    // Check if item already in cart
    const existingCartItem = await CartItem.findOne({ userId, itemId });

    if (existingCartItem) {
      // Update quantity if already in cart
      existingCartItem.quantity += quantity || 1;
      const updated = await existingCartItem.save();
      return res.json({
        success: true,
        message: 'Item quantity updated in cart',
        data: updated
      });
    }

    // Add new item to cart
    const newCartItem = new CartItem({
      userId,
      itemId,
      name,
      price,
      quantity: quantity || 1,
      image,
      category
    });

    const result = await newCartItem.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: result
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Get all cart items for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.params.userId });

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      success: true,
      data: cartItems,
      total: total,
      count: cartItems.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart items',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/update/:cartItemId', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cartItem = await CartItem.findByIdAndUpdate(
      req.params.cartItemId,
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/remove/:cartItemId', async (req, res) => {
  try {
    const cartItem = await CartItem.findByIdAndDelete(req.params.cartItemId);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cartItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
});

// Clear entire cart for a user
router.delete('/clear/:userId', async (req, res) => {
  try {
    const result = await CartItem.deleteMany({ userId: req.params.userId });

    res.json({
      success: true,
      message: 'Cart cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

module.exports = router;
