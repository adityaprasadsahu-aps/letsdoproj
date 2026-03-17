const express = require('express');
const cors = require('cors');
const cartRouter = require('./routes/cart');

const app = express();
const PORT = 5000;
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/cart', cartRouter);
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
