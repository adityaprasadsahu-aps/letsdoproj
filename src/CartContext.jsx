import { createContext, useContext, useState, useEffect } from 'react';
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart as clearCartApi,
} from './api/cartApi';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart_items';

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // On mount: load from backend (source of truth), fallback to localStorage
  useEffect(() => {
    fetchCart()
      .then((items) => {
        if (items && items.length > 0) {
          setCartItems(items);
          saveToStorage(items);
        } else {
          // Backend empty — try localStorage (e.g. server was restarted)
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setCartItems(JSON.parse(saved));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // Backend unreachable — fall back to localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setCartItems(JSON.parse(saved));
        } catch {
          // ignore
        }
      });
  }, []);

  // Keep localStorage in sync whenever cartItems changes
  useEffect(() => {
    saveToStorage(cartItems);
  }, [cartItems]);

  // Add item or increment qty
  const addToCart = async (item) => {
    // Optimistic UI update
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

    // Sync to backend
    try {
      await addItemToCart(item);
    } catch (err) {
      console.error('Failed to sync addToCart with backend:', err);
    }
  };

  // Remove a specific item
  const removeItem = async (id, series) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.series === series)));
    try {
      await removeItemFromCart(id, series);
    } catch (err) {
      console.error('Failed to sync removeItem with backend:', err);
    }
  };

  // Increase quantity by 1
  const increaseQuantity = async (id, series) => {
    let newQty = 1;
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === id && i.series === series) {
          newQty = i.quantity + 1;
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
    try {
      await updateCartItem(id, series, newQty);
    } catch (err) {
      console.error('Failed to sync increaseQuantity with backend:', err);
    }
  };

  // Decrease quantity by 1 (min = 1)
  const decreaseQuantity = async (id, series) => {
    let newQty = 1;
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === id && i.series === series && i.quantity > 1) {
          newQty = i.quantity - 1;
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
    try {
      // Find current qty to only update if actually changed
      const item = cartItems.find((i) => i.id === id && i.series === series);
      if (item && item.quantity > 1) {
        await updateCartItem(id, series, item.quantity - 1);
      }
    } catch (err) {
      console.error('Failed to sync decreaseQuantity with backend:', err);
    }
  };

  // Clear all items
  const clearCart = async () => {
    setCartItems([]);
    try {
      await clearCartApi();
    } catch (err) {
      console.error('Failed to sync clearCart with backend:', err);
    }
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
