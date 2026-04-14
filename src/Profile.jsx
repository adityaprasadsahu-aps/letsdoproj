import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Profile.css';

function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    fetchOrders();
  }, [isLoggedIn]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders?userId=${user.userId}`);
      const data = await res.json();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    setPwError(''); setPwSuccess('');

    if (pwForm.newPassword !== pwForm.confirmPassword)
      return setPwError('New passwords do not match.');
    if (pwForm.newPassword.length < 8)
      return setPwError('New password must be at least 8 characters.');

    setPwLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/users/${user.userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      });
      const data = await res.json();
      if (!res.ok) return setPwError(data.error || 'Failed to update password.');
      setPwSuccess('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setPwError('Cannot connect to server.');
    } finally {
      setPwLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const map = { Processing: '#f59e0b', Shipped: '#3b82f6', Delivered: '#10b981', Cancelled: '#ef4444' };
    return map[status] || '#6b7280';
  };

  if (!isLoggedIn) return null;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="profile-back-btn" onClick={() => navigate('/')}>← Back to Store</button>
        <div className="profile-hero">
          <div className="profile-avatar">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <h1>{user.fullName}</h1>
            <p>Member since 2025</p>
          </div>
          <button className="profile-logout-btn" onClick={() => { logout(); navigate('/'); }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-container">
        <div className="profile-tabs">
          {['orders', 'settings'].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'orders' ? '📦 My Orders' : '⚙️ Settings'}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="profile-section">
            <h2>Order History</h2>
            {ordersLoading ? (
              <div className="profile-loader">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="profile-empty">
                <div className="profile-empty-icon">📭</div>
                <p>No orders yet. Start shopping!</p>
                <button className="profile-btn" onClick={() => navigate('/collections')}>Browse Collections</button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <span className="order-status" style={{ background: getStatusColor(order.status) }}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          {item.image && <img src={item.image} alt={item.name} className="order-item-img" />}
                          <div className="order-item-details">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-series">{item.series} Series</span>
                          </div>
                          <div className="order-item-right">
                            <span className="order-item-qty">×{item.quantity}</span>
                            <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-card-footer">
                      <span>Total:</span>
                      <span className="order-total">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="profile-section">
            <h2>Account Settings</h2>
            <div className="settings-card">
              <h3>Change Password</h3>
              <form onSubmit={handlePwChange} className="settings-form">
                <div className="settings-field">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="settings-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
                <div className="settings-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {pwError && <p className="settings-error">⚠️ {pwError}</p>}
                {pwSuccess && <p className="settings-success">✅ {pwSuccess}</p>}
                <button type="submit" className="profile-btn" disabled={pwLoading}>
                  {pwLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
