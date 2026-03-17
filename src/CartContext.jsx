import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart_items';

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadFromStorage);

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    saveToStorage(cartItems);
  }, [cartItems]);

  // Add item (or increment qty if already present)
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.series === item.series);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.series === item.series
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove a specific item
  const removeItem = (id, series) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.series === series)));
  };

  // Increase quantity by 1
  const increaseQuantity = (id, series) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.series === series ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // Decrease quantity by 1 (min = 1)
  const decreaseQuantity = (id, series) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.series === series && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
