const express = require('express');
const router = express.Router();
const RegistrationDetail = require('../models/Registration');

// Registration endpoint using Mongoose
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required.'
      });
    }

    // Check if email already exists
    const existingUser = await RegistrationDetail.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.'
      });
    }

    // Create new registration
    const newRegistration = new RegistrationDetail({
      fullName,
      email,
      password // Note: In production, hash the password with bcrypt!
    });

    // Save to MongoDB
    const result = await newRegistration.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        _id: result._id,
        fullName: result.fullName,
        email: result.email,
        createdAt: result.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed.',
      error: error.message
    });
  }
});

// Get all registrations (for admin purposes)
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await RegistrationDetail.find({}).select('-password');

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations.',
      error: error.message
    });
  }
});

module.exports = router;
