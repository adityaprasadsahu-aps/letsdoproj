import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  fetchCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart as clearCartApi,
} from '../api/cartApi';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart_items';

function saveToStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const { user, isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load THIS user's cart from backend when they log in / on mount
  useEffect(() => {
    if (!isLoggedIn || !user?.userId) {
      setCartItems([]); // clear cart if logged out
      return;
    }

    fetchCart(user.userId)
      .then((items) => {
        if (items) {
          setCartItems(items);
          saveToStorage(items);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch cart:', err);
        // fallback to localStorage
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setCartItems(JSON.parse(saved));
        } catch { /* ignore */ }
      });
  }, [isLoggedIn, user?.userId]);

  // Keep localStorage in sync
  useEffect(() => {
    saveToStorage(cartItems);
  }, [cartItems]);

  // Add item — redirects to /login if not authenticated
  const addToCart = async (item) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

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

    try {
      await addItemToCart(user.userId, item);
    } catch (err) {
      console.error('Failed to sync addToCart:', err);
    }
  };

  // Remove item
  const removeItem = async (id, series) => {
    if (!isLoggedIn) return;
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.series === series)));
    try {
      await removeItemFromCart(user.userId, id, series);
    } catch (err) {
      console.error('Failed to sync removeItem:', err);
    }
  };

  // Increase quantity
  const increaseQuantity = async (id, series) => {
    if (!isLoggedIn) return;
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
      await updateCartItem(user.userId, id, series, newQty);
    } catch (err) {
      console.error('Failed to sync increaseQuantity:', err);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (id, series) => {
    if (!isLoggedIn) return;
    const item = cartItems.find((i) => i.id === id && i.series === series);
    if (!item || item.quantity <= 1) return;

    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.series === series ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
    try {
      await updateCartItem(user.userId, id, series, item.quantity - 1);
    } catch (err) {
      console.error('Failed to sync decreaseQuantity:', err);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!isLoggedIn) return;
    setCartItems([]);
    try {
      await clearCartApi(user.userId);
    } catch (err) {
      console.error('Failed to sync clearCart:', err);
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
