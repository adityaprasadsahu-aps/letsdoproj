import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Add item; if already in cart, increment quantity
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

  const removeItem = (id, series) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.series === series)));
  };

  const increaseQuantity = (id, series) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.series === series ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const decreaseQuantity = (id, series) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.series === series && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeItem, increaseQuantity, decreaseQuantity, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
