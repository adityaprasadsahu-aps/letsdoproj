const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
});

// Add new item
router.post('/', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, and price are required'
      });
    }

    const newItem = new Item({
      name,
      description,
      price,
      image,
      category,
      stock
    });

    const result = await newItem.save();

    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding item',
      error: error.message
    });
  }
});

// Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, category, stock },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
});

module.exports = router;
