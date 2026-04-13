const express = require('express');
const Discount = require('../models/Discount');
const Item = require('../models/Item');

const router = express.Router();

// Get all active discounts
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    
    // Find all discounts and mark expired ones as inactive
    const discounts = await Discount.find();
    
    // Update expired discounts
    discounts.forEach(async (discount) => {
      if (discount.isActive && discount.endTime < now) {
        await Discount.findByIdAndUpdate(discount._id, { isActive: false });
      }
    });

    // Return active discounts
    const activeDiscounts = await Discount.find({ isActive: true }).populate('itemId');
    
    res.json({
      success: true,
      data: activeDiscounts
    });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts'
    });
  }
});

// Get all discounts (including inactive)
router.get('/all', async (req, res) => {
  try {
    const discounts = await Discount.find().populate('itemId').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: discounts
    });
  } catch (error) {
    console.error('Error fetching all discounts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discounts'
    });
  }
});

// Add new discount
router.post('/', async (req, res) => {
  try {
    const { itemId, discountPercentage, durationHours } = req.body;

    if (!itemId || !discountPercentage || !durationHours) {
      return res.status(400).json({
        success: false,
        message: 'itemId, discountPercentage, and durationHours are required'
      });
    }

    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Calculate end time
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + parseInt(durationHours));

    const discount = new Discount({
      itemId,
      itemName: item.name,
      discountPercentage,
      endTime,
      isActive: true
    });

    const savedDiscount = await discount.save();
    const populatedDiscount = await Discount.findById(savedDiscount._id).populate('itemId');

    res.status(201).json({
      success: true,
      message: 'Discount added successfully',
      data: populatedDiscount
    });
  } catch (error) {
    console.error('Error adding discount:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding discount',
      error: error.message
    });
  }
});

// Update discount
router.put('/:id', async (req, res) => {
  try {
    const { discountPercentage, durationHours } = req.body;

    const updateData = { updatedAt: new Date() };

    if (discountPercentage !== undefined) {
      updateData.discountPercentage = discountPercentage;
    }

    if (durationHours !== undefined) {
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + parseInt(durationHours));
      updateData.endTime = endTime;
    }

    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('itemId');

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      message: 'Discount updated successfully',
      data: discount
    });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating discount',
      error: error.message
    });
  }
});

// Delete discount
router.delete('/:id', async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: 'Discount not found'
      });
    }

    res.json({
      success: true,
      message: 'Discount deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting discount',
      error: error.message
    });
  }
});

// Deactivate discount
router.put('/:id/deactivate', async (req, res) => {
  try {
    const discount = await Discount.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).populate('itemId');

    res.json({
      success: true,
      message: 'Discount deactivated',
      data: discount
    });
  } catch (error) {
    console.error('Error deactivating discount:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating discount'
    });
  }
});

// Get discount by item ID
router.get('/item/:itemId', async (req, res) => {
  try {
    const discount = await Discount.findOne({ 
      itemId: req.params.itemId, 
      isActive: true 
    });

    res.json({
      success: true,
      data: discount || null
    });
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount'
    });
  }
});

module.exports = router;
