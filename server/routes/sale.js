const express = require('express');
const Sale = require('../models/Sale');

const router = express.Router();

// Get current sale info or initialize it
router.get('/current', async (req, res) => {
  try {
    let sale = await Sale.findOne({ saleId: 'limited-time-sale' });

    // If no sale exists or it has expired, create a new one
    if (!sale || new Date() > sale.endTime) {
      const newEndTime = new Date();
      newEndTime.setDate(newEndTime.getDate() + 7); // 7 days from now

      sale = await Sale.findOneAndUpdate(
        { saleId: 'limited-time-sale' },
        {
          title: 'Limited Time Sale',
          endTime: newEndTime,
          discount: 40,
          isActive: true,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Error fetching sale info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sale information'
    });
  }
});

// Admin endpoint to update sale end time
router.put('/update-end-time', async (req, res) => {
  try {
    const { endTime } = req.body;

    if (!endTime) {
      return res.status(400).json({
        success: false,
        message: 'endTime is required'
      });
    }

    const sale = await Sale.findOneAndUpdate(
      { saleId: 'limited-time-sale' },
      {
        endTime: new Date(endTime),
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Sale end time updated successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error updating sale end time:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating sale end time'
    });
  }
});

// Admin endpoint to toggle sale active status
router.put('/toggle-active', async (req, res) => {
  try {
    const sale = await Sale.findOne({ saleId: 'limited-time-sale' });

    const updatedSale = await Sale.findOneAndUpdate(
      { saleId: 'limited-time-sale' },
      {
        isActive: !sale.isActive,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Sale status updated',
      data: updatedSale
    });
  } catch (error) {
    console.error('Error toggling sale status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling sale status'
    });
  }
});

module.exports = router;
