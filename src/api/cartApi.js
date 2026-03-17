const BASE_URL = 'http://localhost:5000/api/cart';

export async function fetchCart() {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  return json.data;
}

/**
 * POST /api/cart
 * Adds an item to the cart, or increments its quantity if it already exists.
 * @param {{ id, name, series, price, image }} item
 */
export async function addItemToCart(item) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  const json = await res.json();
  return json.data;
}

/**
 * PUT /api/cart/:id
 * Updates the quantity of a specific cart item.
 * @param {number} id
 * @param {string} series
 * @param {number} quantity
 */
export async function updateCartItem(id, series, quantity) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity, series }),
  });
  const json = await res.json();
  return json.data;
}

/**
 * DELETE /api/cart/:id?series=...
 * Removes a specific item from the cart.
 * @param {number} id
 * @param {string} series
 */
export async function removeItemFromCart(id, series) {
  const res = await fetch(`${BASE_URL}/${id}?series=${encodeURIComponent(series)}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  return json;
}

/**
 * DELETE /api/cart
 * Clears all items from the cart.
 */
export async function clearCart() {
  const res = await fetch(BASE_URL, { method: 'DELETE' });
  const json = await res.json();
  return json;
}
