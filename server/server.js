const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cartRouter = require('./routes/cart');

const app = express();
const PORT = 5000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb://adityasaahu_db_user:QYYzk8nNhY7pJ7I5@ac-0x3xb9x-shard-00-00.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-01.4tjktih.mongodb.net:27017,ac-0x3xb9x-shard-00-02.4tjktih.mongodb.net:27017/mydb?ssl=true&replicaSet=atlas-zpcxb2-shard-0&authSource=admin&appName=Etech')
  .then(() => console.log('MongoDB Connected — Atlas mydb (direct)'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// ─── Schemas & Models ─────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  fullName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  isAdmin:   { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  id:             { type: Number, required: true },
  name:           { type: String, required: true },
  series:         { type: String, required: true },  // e.g. 'Classic'
  seriesKey:      { type: String, required: true },  // e.g. 'classic'
  image:          { type: String, default: '' },
  price:          { type: String, required: true },
  rating:         { type: Number, default: 4.5 },
  reviews:        { type: Number, default: 0 },
  description:    { type: String, default: '' },
  specifications: { type: Object, default: {} },
  colors:         { type: [String], default: [] },
  inStock:        { type: Boolean, default: true },
  limited:        { type: String, default: '' },
  createdAt:      { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

const offerSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  subtitle:    { type: String, default: '' },
  description: { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  buttonText:  { type: String, default: 'Shop Now' },
  buttonLink:  { type: String, default: '/collections' },
  discount:    { type: String, default: '' },
  active:      { type: Boolean, default: true },
  createdAt:   { type: Date, default: Date.now }
});
const Offer = mongoose.model('Offer', offerSchema);

const orderSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  items:     [{ name: String, series: String, price: Number, quantity: Number, image: String }],
  total:     { type: Number, required: true },
  status:    { type: String, default: 'Processing', enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

const contactMessageSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api/cart', cartRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Unified API Server is running', status: 'OK' });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email.toLowerCase() === 'adityapstemp@gmail.com';
    const user = new User({ fullName, email, password: hashedPassword, isAdmin });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid email or password' });

    res.json({
      message: 'Login successful',
      userId:   user._id,
      fullName: user.fullName,
      isAdmin:  user.isAdmin
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── User Routes ──────────────────────────────────────────────────────────────
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/users/:id/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: update user credentials / isAdmin
app.put('/api/users/:id', async (req, res) => {
  try {
    const { fullName, email, isAdmin, newPassword } = req.body;
    const update = {};
    if (fullName !== undefined) update.fullName = fullName;
    if (email !== undefined) update.email = email.toLowerCase();
    if (isAdmin !== undefined) update.isAdmin = isAdmin;
    if (newPassword) update.password = await bcrypt.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Order Routes ─────────────────────────────────────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total } = req.body;
    if (!userId || !items || !total)
      return res.status(400).json({ error: 'userId, items, and total are required' });
    const order = new Order({ userId, items, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Contact Message Routes ───────────────────────────────────────────────────
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ error: 'Name, email, and message are required' });
    const contactMessage = new ContactMessage({ name, email, message });
    await contactMessage.save();
    res.status(201).json({ message: 'Contact message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Product Routes ───────────────────────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const { series } = req.query;
    const filter = series ? { seriesKey: series.toLowerCase() } : {};
    const products = await Product.find(filter).sort({ seriesKey: 1, id: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

app.put('/api/products/:mongoId', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.mongoId, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/products/:mongoId', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.mongoId);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Offer Routes ─────────────────────────────────────────────────────────────
app.get('/api/offers', async (req, res) => {
  try {
    const offers = await Offer.find({ active: true }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/offers/all', async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/offers', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    res.json(offer);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── Seed Admin ───────────────────────────────────────────────────────────────
async function seedAdmin() {
  try {
    const admin = await User.findOne({ email: 'adityapstemp@gmail.com' });
    if (admin && !admin.isAdmin) {
      admin.isAdmin = true;
      await admin.save();
      console.log('  ✅ adityapstemp@gmail.com promoted to Admin');
    } else if (!admin) {
      console.log('  ℹ️  Admin user (adityapstemp@gmail.com) not registered yet — will be Admin on first registration.');
    }
  } catch (e) {
    console.error('  seedAdmin error:', e.message);
  }
}
mongoose.connection.once('open', seedAdmin);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Unified API Server running at http://localhost:${PORT}`);
  console.log(`  Auth:     POST /api/register | POST /api/login`);
  console.log(`  Products: GET/POST/PUT/DELETE /api/products`);
  console.log(`  Offers:   GET/POST/PUT/DELETE /api/offers`);
  console.log(`  Orders:   GET/POST /api/orders`);
  console.log(`  Users:    GET/PUT/DELETE /api/users\n`);
});
