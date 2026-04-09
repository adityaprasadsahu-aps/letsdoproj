const BASE_URL = 'http://localhost:5000/api/cart';

// GET /api/cart?userId=xxx
export async function fetchCart(userId) {
  const res = await fetch(`${BASE_URL}?userId=${encodeURIComponent(userId)}`);
  const json = await res.json();
  return json.data;
}

// POST /api/cart — add item (userId included in body)
export async function addItemToCart(userId, item) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...item }),
  });
  const json = await res.json();
  return json.data;
}

// PUT /api/cart/:id — update quantity
export async function updateCartItem(userId, id, series, quantity) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, quantity, series }),
  });
  const json = await res.json();
  return json.data;
}

// DELETE /api/cart/:id?userId=xxx&series=xxx — remove one item
export async function removeItemFromCart(userId, id, series) {
  const res = await fetch(
    `${BASE_URL}/${id}?userId=${encodeURIComponent(userId)}&series=${encodeURIComponent(series)}`,
    { method: 'DELETE' }
  );
  const json = await res.json();
  return json;
}

// DELETE /api/cart?userId=xxx — clear this user's cart
export async function clearCart(userId) {
  const res = await fetch(`${BASE_URL}?userId=${encodeURIComponent(userId)}`, { method: 'DELETE' });
  const json = await res.json();
  return json;
}
