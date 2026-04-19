import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuth();
  const { cartItems, clearCart } = useCart();

  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '' });
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user address if it exists
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    if (user && user.address) {
      setAddress(user.address);
    }
  }, [isLoggedIn, navigate, user, cartItems]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = cartItems.length > 0 ? 15.00 : 0;
  const total = subtotal + tax + shipping;

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      setError('Please fill in all address fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Optionally save address to user profile if it's new/modified
      await fetch(`http://localhost:5000/api/users/${user.userId}/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      updateUser({ address }); // update local context

      // 2. Submit Order
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          items: cartItems,
          total: total,
          shippingAddress: address,
          paymentMethod: paymentMethod
        })
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      // Order Success
      clearCart();
      navigate('/profile'); // Redirect to profile where they can see 'My Orders'
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="checkout-container">
      <Breadcrumb />
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Shipping Address</h2>
          {error && <div className="checkout-error">{error}</div>}
          <form className="checkout-form" onSubmit={submitOrder}>
            <div className="form-group">
              <label>Street Address</label>
              <input type="text" name="street" value={address.street || ''} onChange={handleAddressChange} required placeholder="123 Main St" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={address.city || ''} onChange={handleAddressChange} required placeholder="New York" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={address.state || ''} onChange={handleAddressChange} required placeholder="NY" />
              </div>
            </div>
            <div className="form-group half-width">
              <label>ZIP Code</label>
              <input type="text" name="zipCode" value={address.zipCode || ''} onChange={handleAddressChange} required placeholder="10001" />
            </div>

            <h2 className="payment-heading">Payment Method</h2>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'Cash' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} />
                Cash on Delivery (COD)
              </label>
              <label className={`payment-option ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                <input type="radio" name="payment" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} />
                UPI / Quick Pay
              </label>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="checkout-summary-section">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cartItems.map((item, idx) => (
              <div key={idx} className="checkout-item">
                <span>{item.quantity}x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
