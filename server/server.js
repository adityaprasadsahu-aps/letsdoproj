const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cartRouter = require('./routes/cart');

const app = express();
const PORT = 5000;

// Connect to MongoDB Atlas — direct connection (bypasses DNS SRV blocking)
mongoose.connect('mongodb://adityasaahu_db_user:QYYzk8nNhY7pJ7I5@ac-0x3xb9x-shard-00-00.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-01.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-02.4tjktih.mongodb.net:27017/mydb?ssl=true&replicaSet=atlas-zpcxb2-shard-0&authSource=admin&appName=Etech')
  .then(() => console.log('MongoDB Connected — Atlas mydb (direct)'))
  .catch(err => console.error('MongoDB connection error:', err.message));

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
