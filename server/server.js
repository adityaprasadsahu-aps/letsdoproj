const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const cartRouter = require('./routes/cart');
const registrationRouter = require('./routes/registration');
const itemRouter = require('./routes/items');
const cartItemsRouter = require('./routes/cartitems');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✓ Connected to MongoDB'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/cart', cartRouter);
app.use('/api/cartitems', cartItemsRouter);
app.use('/api/auth', registrationRouter);
app.use('/api/items', itemRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Cart API Server is running', status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`\n  Cart API Server running at http://localhost:${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/cart`);
  console.log(`   POST   http://localhost:${PORT}/api/cart`);
  console.log(`   PUT    http://localhost:${PORT}/api/cart/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/cart/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/cart\n`);
});
