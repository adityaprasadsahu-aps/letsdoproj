const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

const router = express.Router();

// Configure nodemailer for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_PASS || 'your-app-password'
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service configuration error:', error.message);
  } else {
    console.log('Email service ready');
  }
});

// POST - Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 5000 characters'
      });
    }

    // Create contact record
    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

    // Send confirmation email to customer
    const customerEmailOptions = {
      from: process.env.GMAIL_USER || 'noreply@chronos.com',
      to: email,
      subject: `We Received Your Message - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <header style="background: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">CHRONOS</h1>
            <p style="margin: 8px 0 0; opacity: 0.8;">Official Watch House</p>
          </header>
          
          <main style="padding: 30px; background: #f8f8f8;">
            <h2 style="color: #0f172a; margin-top: 0;">Thank you for contacting us!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Dear <strong>${name}</strong>,
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              We have received your message with subject <strong>"${subject}"</strong> and will review it carefully. Our team will get back to you within 1-2 business days.
            </p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #0f172a; margin-top: 0;">Your Message Summary:</h3>
              <p style="margin: 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject}</p>
              <p style="margin: 8px 0; color: #666; font-style: italic;">${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              In the meantime, you can:
            </p>
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our <a href="http://localhost:3000/faqs" style="color: #3b82f6; text-decoration: none;">FAQs</a> for quick answers</li>
              <li>Visit our <a href="http://localhost:3000/service-centers" style="color: #3b82f6; text-decoration: none;">Service Centers</a></li>
              <li>Check your <a href="http://localhost:3000/warranty" style="color: #3b82f6; text-decoration: none;">Warranty</a> information</li>
            </ul>
            
            <p style="color: #666; margin-top: 20px;">
              Reference ID: <code style="background: #e0e0e0; padding: 2px 6px; border-radius: 3px;">${contact._id}</code>
            </p>
          </main>
          
          <footer style="background: #0f172a; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px;">
            <p style="margin: 0; opacity: 0.8;">© 2026 CHRONOS WATCHES. All rights reserved.</p>
            <p style="margin: 8px 0 0; opacity: 0.6;">support@chronos.in | +91 811-4611-204</p>
          </footer>
        </div>
      `
    };

    // Send admin notification
    const adminEmailOptions = {
      from: process.env.GMAIL_USER || 'noreply@chronos.com',
      to: 'adityapstemp@gmail.com',
      subject: `[NEW] Contact Form Submission - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
          <header style="background: #e45000; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0;">
            <h2 style="margin: 0;">New Contact Message</h2>
          </header>
          
          <main style="padding: 20px; background: #f8f8f8; border: 1px solid #ddd;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd; width: 120px;">Name:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd;">Email:</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd;">Subject:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd; vertical-align: top;">Message:</td>
                <td style="padding: 10px; border: 1px solid #ddd; white-space: pre-wrap;">${message}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd;">Received:</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; background: #e8f4f8; border: 1px solid #ddd;">ID:</td>
                <td style="padding: 10px; border: 1px solid #ddd;"><code>${contact._id}</code></td>
              </tr>
            </table>
            
            <p style="marginTop: 15px; text-align: center;">
              <a href="http://localhost:3000/admin" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                VIEW IN ADMIN
              </a>
            </p>
          </main>
        </div>
      `
    };

    // Send emails asynchronously (don't wait for completion)
    transporter.sendMail(customerEmailOptions, (err, info) => {
      if (err) {
        console.error('Error sending customer email:', err.message);
      } else {
        console.log('Customer confirmation email sent:', info.messageId);
      }
    });

    transporter.sendMail(adminEmailOptions, (err, info) => {
      if (err) {
        console.error('Error sending admin email:', err.message);
      } else {
        console.log('Admin notification email sent:', info.messageId);
      }
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Message received successfully. We will get back to you soon!',
      data: {
        id: contact._id,
        email: contact.email,
        status: contact.status
      }
    });

  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to submit message. Please try again later.'
    });
  }
});

// GET - Fetch all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      data: contacts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// GET - Fetch single message by ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// PUT - Update message status and notes (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        respondedAt: status === 'responded' ? new Date() : null
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Message updated',
      data: contact
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// DELETE - Delete a contact message (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Message deleted'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
