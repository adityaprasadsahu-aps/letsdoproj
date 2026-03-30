import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import './cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userEmail') || 'guest';

  // Fetch cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cartitems/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setCartItems(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch cart items');
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Error loading cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/remove/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        setCartItems(cartItems.filter(item => item._id !== cartItemId));
      } else {
        alert('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Error removing item from cart');
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cartitems/update/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      const data = await response.json();
      
      if (data.success) {
        setCartItems(cartItems.map(item => 
          item._id === cartItemId ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        alert('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Error updating item quantity');
    }
  };

  const increaseQuantity = (cartItemId, currentQuantity) => {
    updateQuantity(cartItemId, currentQuantity + 1);
  };

  const decreaseQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(cartItemId, currentQuantity - 1);
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/cartitems/clear/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        if (data.success) {
          setCartItems([]);
        } else {
          alert('Failed to clear cart');
        }
      } catch (err) {
        console.error('Error clearing cart:', err);
        alert('Error clearing cart');
      }
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="cart-container">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading cart...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h2>{error}</h2>
          <button onClick={fetchCartItems} className="explore-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </button>
        <h1>Shopping Cart</h1>
        <div style={{ width: '120px' }}></div>
      </div>

      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛍️</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any watches yet.</p>
            <button
              onClick={() => navigate('/collections')}
              className="explore-btn"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-main">
            <div className="cart-items-section">
              <h2>Cart Items ({cartItems.length})</h2>
              <div className="items-list">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <div className="item-image">
                      <img
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EWatch Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="series">{item.category}</p>
                      <p className="price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQuantity(item._id, item.quantity)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQuantity(item._id, item.quantity)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="item-total">
                      <p className="total-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item._id)}
                      title="Remove from cart"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
              
              <button
                className="continue-shopping-btn"
                onClick={() => navigate('/collections')}
              >
                Continue Shopping
              </button>

              <button
                className="continue-shopping-btn"
                onClick={clearCart}
                style={{ backgroundColor: '#dc3545' }}
              >
                Clear Cart
              </button>

              <div className="promo-section">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="promo-input"
                />
              </div>

              <div className="security-info">
                <p>✓ Secure checkout with SSL encryption</p>
                <p>✓ Free returns within 30 days</p>
                <p>✓ 2-year international warranty</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
