const express = require('express');
const router = express.Router();
let cartItems = [];
router.get('/', (req, res) => {
  res.json({ success: true, data: cartItems });
});
router.post('/', (req, res) => {
  const { id, name, series, price, image } = req.body;

  if (!id || !name || !series || price === undefined) {
    return res.status(400).json({ success: false, message: 'id, name, series, and price are required.' });
  }

  const existing = cartItems.find(i => i.id === id && i.series === series);

  if (existing) {
    existing.quantity += 1;
    return res.json({ success: true, message: 'Quantity incremented.', data: existing });
  }

  const newItem = { id, name, series, price, image: image || '', quantity: 1 };
  cartItems.push(newItem);
  res.status(201).json({ success: true, message: 'Item added to cart.', data: newItem });
});

router.put('/:id', (req, res) => {
  const itemId = Number(req.params.id);
  const { quantity, series } = req.body;

  if (quantity === undefined || quantity < 1) {
    return res.status(400).json({ success: false, message: 'quantity must be a positive number.' });
  }

  const item = cartItems.find(i => i.id === itemId && i.series === series);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  item.quantity = quantity;
  res.json({ success: true, message: 'Quantity updated.', data: item });
});

router.delete('/:id', (req, res) => {
  const itemId = Number(req.params.id);
  const { series } = req.query;

  const index = cartItems.findIndex(i => i.id === itemId && i.series === series);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found in cart.' });
  }

  const removed = cartItems.splice(index, 1)[0];
  res.json({ success: true, message: 'Item removed from cart.', data: removed });
});
router.delete('/', (req, res) => {
  cartItems = [];
  res.json({ success: true, message: 'Cart cleared.' });
});

module.exports = router;
