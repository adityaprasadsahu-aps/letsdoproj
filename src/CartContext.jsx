import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userEmail') || 'guest';
  const pollIntervalRef = useRef(null);

  // Function to fetch cart from database - memoized to prevent unnecessary updates
  const fetchCartFromDB = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart from DB:', err);
    }
  }, [userId]);

  // Fetch cart on mount and set up polling + visibility listener
  useEffect(() => {
    // Clear old localStorage cart data
    localStorage.removeItem('cart_items');

    const initialFetch = async () => {
      setLoading(true);
      await fetchCartFromDB();
      setLoading(false);
    };

    initialFetch();

    // Refetch cart when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCartFromDB();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Poll cart every 5 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchCartFromDB();
    }, 5000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchCartFromDB]);

  // Add item to database
  const addToCart = async (item) => {
    try {
      const response = await fetch('http://localhost:5000/api/cartitems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: userId,
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          quantity: item.quantity || 1
        })
      });

      const data = await response.json();
      if (data.success) {
        // Immediately refetch to get latest cart
        await fetchCartFromDB();
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  // Remove item from database
  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/remove/${itemId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        // Immediately refetch to get latest cart
        await fetchCartFromDB();
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
    }
  };

  // Increase quantity in database
  const increaseQuantity = async (itemId, currentQty) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: currentQty + 1 })
      });

      const data = await response.json();
      if (data.success) {
        // Immediately refetch to get latest cart
        await fetchCartFromDB();
      }
    } catch (err) {
      console.error('Error increasing quantity:', err);
    }
  };

  // Decrease quantity in database
  const decreaseQuantity = async (itemId, currentQty) => {
    if (currentQty <= 1) {
      removeItem(itemId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: currentQty - 1 })
      });

      const data = await response.json();
      if (data.success) {
        // Immediately refetch to get latest cart
        await fetchCartFromDB();
      }
    } catch (err) {
      console.error('Error decreasing quantity:', err);
    }
  };

  // Clear all items from database
  const clearCart = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/clear/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        // Immediately refetch to clear cart
        await fetchCartFromDB();
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

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
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
