import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import './cart.css';

function Cart() {
  const navigate = useNavigate();
  
  // Sample cart items - will be replaced with MongoDB later
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Classic Minimalist',
      series: 'Classic Series',
      price: 299.99,
      quantity: 1,
      image: '/Watch_Png/Classic Series/Classic1.png'
    },
    {
      id: 2,
      name: 'Explorer Adventurer',
      series: 'Explorer Series',
      price: 399.99,
      quantity: 2,
      image: '/Watch_Png/Explorer Series/Explorer2.png'
    },
    {
      id: 3,
      name: 'Luxury Prestige',
      series: 'Luxury Collection',
      price: 899.99,
      quantity: 1,
      image: '/Watch_Png/Luxury Collection/Luxury1.png'
    }
  ]);

  // Increase quantity
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = subtotal + tax + shipping;

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
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EWatch Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="series">{item.series}</p>
                      <p className="price">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="item-total">
                      <p className="total-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
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
