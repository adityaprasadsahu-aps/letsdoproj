import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/Admin.css';

const API = 'http://localhost:5000/api';

const SERIES_OPTIONS = ['classic', 'explorer', 'signature', 'heritage', 'luxury', 'limited'];

const emptyProduct = {
  id: '', name: '', series: '', seriesKey: '', image: '', price: '',
  description: '', specifications: '', colors: '', inStock: true, limited: ''
};

const emptyOffer = {
  title: '', subtitle: '', description: '', imageUrl: '', buttonText: 'Shop Now', buttonLink: '/collections', discount: '', active: true
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
function Admin() {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // default to orders

  // ─── Orders ──────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // ─── Products ────────────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [prodLoading, setProdLoading] = useState(true);
  const [prodModal, setProdModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [prodForm, setProdForm] = useState(emptyProduct);
  const [prodMsg, setProdMsg] = useState('');
  const [prodFilter, setProdFilter] = useState('');

  // ─── Offers ──────────────────────────────────────────────────────────────────
  const [offers, setOffers] = useState([]);
  const [offModal, setOffModal] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [offForm, setOffForm] = useState(emptyOffer);
  const [offMsg, setOffMsg] = useState('');

  // ─── Users ───────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [userForm, setUserForm] = useState({ fullName: '', email: '', isAdmin: false, newPassword: '' });
  const [userMsg, setUserMsg] = useState('');

  // ─── Contact Messages ─────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // ─── Countdown Timers ─────────────────────────────────────────────────────────
  const [countdownTimers, setCountdownTimers] = useState([]);
  const [countdownModal, setCountdownModal] = useState(false);
  const [editCountdown, setEditCountdown] = useState(null);
  const [countdownForm, setCountdownForm] = useState({
    title: '',
    description: '',
    endTime: '',
    isActive: true
  });
  const [countdownMsg, setCountdownMsg] = useState('');

  // ─── Auth Guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); return; }
  }, [isLoggedIn, isAdmin]);

  // ─── Fetch data on tab switch ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'orders')   fetchOrders();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'offers')   fetchOffers();
    if (activeTab === 'users')    fetchUsers();
    if (activeTab === 'messages') fetchMessages();
    if (activeTab === 'countdown') fetchCountdownTimers();
  }, [activeTab, isAdmin]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API}/orders`);
      setOrders(await res.json());
    } catch { setOrders([]); }
    setOrdersLoading(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setProdLoading(true);
    try {
      const res = await fetch(`${API}/products`);
      setProducts(await res.json());
    } catch { setProducts([]); }
    setProdLoading(false);
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API}/offers/all`);
      setOffers(await res.json());
    } catch { setOffers([]); }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch(`${API}/users`);
      setUsers(await res.json());
    } catch { setUsers([]); }
    setUsersLoading(false);
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`${API}/contact`);
      setMessages(await res.json());
    } catch {
      setMessages([]);
    }
    setMessagesLoading(false);
  };

  const updateMessageStatus = async (messageId, status) => {
    try {
      const res = await fetch(`${API}/contact/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchMessages();
      } else {
        console.error('Failed to update status', await res.text());
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`${API}/contact/${messageId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMessages();
      } else {
        console.error('Failed to delete message', await res.text());
      }
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  // ─── Countdown Timer CRUD ─────────────────────────────────────────────────────
  const fetchCountdownTimers = async () => {
    try {
      const res = await fetch(`${API}/countdown/all`);
      setCountdownTimers(await res.json());
    } catch {
      setCountdownTimers([]);
    }
  };

  const saveCountdownTimer = async (e) => {
    e.preventDefault();
    setCountdownMsg('Saving...');
    try {
      const method = editCountdown ? 'PUT' : 'POST';
      const url = editCountdown ? `${API}/countdown/${editCountdown._id}` : `${API}/countdown`;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(countdownForm)
      });
      if (res.ok) {
        setCountdownMsg('Timer saved successfully!');
        setCountdownModal(false);
        setEditCountdown(null);
        setCountdownForm({ title: '', description: '', endTime: '', isActive: true });
        fetchCountdownTimers();
        setTimeout(() => setCountdownMsg(''), 3000);
      } else {
        setCountdownMsg('Failed to save timer');
      }
    } catch {
      setCountdownMsg('Error saving timer');
    }
  };

  const openAddCountdown = () => {
    setEditCountdown(null);
    setCountdownForm({ title: '', description: '', endTime: '', isActive: true });
    setCountdownMsg('');
    setCountdownModal(true);
  };

  const openEditCountdown = (timer) => {
    setEditCountdown(timer);
    setCountdownForm({
      title: timer.title,
      description: timer.description,
      endTime: new Date(timer.endTime).toISOString().slice(0, 16),
      isActive: timer.isActive
    });
    setCountdownMsg('');
    setCountdownModal(true);
  };

  const deleteCountdownTimer = async (timerId) => {
    if (!window.confirm('Are you sure you want to delete this countdown timer?')) {
      return;
    }
    try {
      const res = await fetch(`${API}/countdown/${timerId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCountdownTimers();
      }
    } catch (err) {
      console.error('Failed to delete timer', err);
    }
  };

  // ─── Product CRUD ─────────────────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditProduct(null);
    setProdForm(emptyProduct);
    setProdMsg('');
    setProdModal(true);
  };

  const openEditProduct = (p) => {
    setEditProduct(p);
    setProdForm({
      ...p,
      specifications: typeof p.specifications === 'object'
        ? Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join('\n')
        : p.specifications || '',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || ''
    });
    setProdMsg('');
    setProdModal(true);
  };

  const parseProdForm = (f) => ({
    ...f,
    id: Number(f.id),
    seriesKey: f.seriesKey || f.series?.toLowerCase(),
    specifications: f.specifications
      ? Object.fromEntries(f.specifications.split('\n').filter(Boolean).map(l => {
          const [k, ...v] = l.split(':');
          return [k.trim(), v.join(':').trim()];
        }))
      : {},
    colors: f.colors ? f.colors.split(',').map(c => c.trim()) : []
  });

  const saveProduct = async (e) => {
    e.preventDefault();
    setProdMsg('');
    const parsed = parseProdForm(prodForm);
    try {
      let res;
      if (editProduct) {
        res = await fetch(`${API}/products/${editProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
      } else {
        res = await fetch(`${API}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed)
        });
      }
      if (!res.ok) { const d = await res.json(); return setProdMsg('❌ ' + (d.error || 'Error')); }
      setProdMsg('✅ Saved!');
      fetchProducts();
      setTimeout(() => setProdModal(false), 800);
    } catch { setProdMsg('❌ Network error'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  // ─── Offer CRUD ───────────────────────────────────────────────────────────────
  const openAddOffer = () => { setEditOffer(null); setOffForm(emptyOffer); setOffMsg(''); setOffModal(true); };
  const openEditOffer = (o) => { setEditOffer(o); setOffForm(o); setOffMsg(''); setOffModal(true); };

  const saveOffer = async (e) => {
    e.preventDefault();
    setOffMsg('');
    try {
      let res;
      if (editOffer) {
        res = await fetch(`${API}/offers/${editOffer._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offForm)
        });
      } else {
        res = await fetch(`${API}/offers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(offForm)
        });
      }
      if (!res.ok) { const d = await res.json(); return setOffMsg('❌ ' + (d.error || 'Error')); }
      setOffMsg('✅ Saved!');
      fetchOffers();
      setTimeout(() => setOffModal(false), 800);
    } catch { setOffMsg('❌ Network error'); }
  };

  const deleteOffer = async (id) => {
    if (!window.confirm('Delete this offer/banner?')) return;
    await fetch(`${API}/offers/${id}`, { method: 'DELETE' });
    fetchOffers();
  };

  // ─── User CRUD ────────────────────────────────────────────────────────────────
  const openEditUser = (u) => {
    setEditUser(u);
    setUserForm({ fullName: u.fullName, email: u.email, isAdmin: u.isAdmin, newPassword: '' });
    setUserMsg('');
  };

  const saveUser = async (e) => {
    e.preventDefault();
    setUserMsg('');
    try {
      const res = await fetch(`${API}/users/${editUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (!res.ok) { const d = await res.json(); return setUserMsg('❌ ' + (d.error || 'Error')); }
      setUserMsg('✅ Saved!');
      fetchUsers();
      setTimeout(() => setEditUser(null), 800);
    } catch { setUserMsg('❌ Network error'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await fetch(`${API}/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const filteredProducts = prodFilter
    ? products.filter(p => p.seriesKey === prodFilter)
    : products;

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-badge">⚙</span>
          <div>
            <div className="admin-logo-title">Admin Portal</div>
            <div className="admin-logo-sub">CHRONOS</div>
          </div>
        </div>
        <nav className="admin-nav">
          {[
            { id: 'orders',   icon: '📦', label: 'Orders' },
            { id: 'products', icon: '🕐', label: 'Products' },
            { id: 'offers',   icon: '🏷️',  label: 'Banners & Offers' },
            { id: 'users',    icon: '👥', label: 'Users' },
            { id: 'messages', icon: '💬', label: 'Contact Messages' },
            { id: 'countdown', icon: '⏰', label: 'Countdown Timer' },
          ].map(t => (
            <button
              key={t.id}
              className={`admin-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="admin-main">
        <div className="admin-main-top">
          <Breadcrumb />
        </div>

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>Orders</h1>
                <p className="admin-subtitle">{orders.length} total orders</p>
              </div>
            </div>

            {ordersLoading ? <div className="admin-loader">Loading orders…</div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Customer ID</th><th>Items</th><th>Total</th><th>Status</th><th>Address</th><th>Payment</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o._id}>
                        <td>...{o._id.slice(-6)}</td>
                        <td>...{o.userId.slice(-6)}</td>
                        <td>{o.items?.length || 0} items (x{o.items?.reduce((s, i) => s + (i.quantity || 1), 0) || 0})</td>
                        <td>${o.total != null ? Number(o.total).toFixed(2) : '0.00'}</td>
                        <td>
                          <select
                            value={o.status || 'Processing'}
                            onChange={e => updateOrderStatus(o._id, e.target.value)}
                            className="admin-status-select"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          {o.shippingAddress ? (
                            <div style={{fontSize: '12px'}}>
                              {o.shippingAddress.street}, {o.shippingAddress.city}<br/>
                              {o.shippingAddress.state} {o.shippingAddress.zipCode}
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td>
                          <span className={`admin-badge ${o.paymentMethod === 'UPI' ? 'admin' : ''}`}>
                            {o.paymentMethod || 'Cash'}
                          </span>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan="8" className="admin-empty-row">No orders found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>Products</h1>
                <p className="admin-subtitle">{products.length} items in store</p>
              </div>
              <div className="admin-header-actions">
                <select
                  className="admin-filter-select"
                  value={prodFilter}
                  onChange={e => setProdFilter(e.target.value)}
                >
                  <option value="">All Series</option>
                  {SERIES_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
                <button className="admin-btn-primary" onClick={openAddProduct}>+ Add Product</button>
              </div>
            </div>

            {prodLoading ? <div className="admin-loader">Loading products…</div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th><th>Name</th><th>Series</th><th>Price</th><th>Stock</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p._id}>
                        <td><img src={p.image} alt={p.name} className="admin-product-thumb" /></td>
                        <td><span className="admin-product-name">{p.name}</span></td>
                        <td><span className="admin-badge">{p.series}</span></td>
                        <td>{p.price}</td>
                        <td><span className={`admin-stock ${p.inStock ? 'in' : 'out'}`}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-btn-edit" onClick={() => openEditProduct(p)}>Edit</button>
                            <button className="admin-btn-delete" onClick={() => deleteProduct(p._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr><td colSpan="6" className="admin-empty-row">No products found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* OFFERS */}
        {activeTab === 'offers' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>Banners & Offers</h1>
                <p className="admin-subtitle">{offers.length} banners configured</p>
              </div>
              <button className="admin-btn-primary" onClick={openAddOffer}>+ Add Banner</button>
            </div>
            <div className="admin-offers-grid">
              {offers.map(o => (
                <div key={o._id} className={`admin-offer-card ${!o.active ? 'inactive' : ''}`}>
                  {o.imageUrl && <img src={o.imageUrl} alt={o.title} className="admin-offer-img" />}
                  <div className="admin-offer-info">
                    <div className="admin-offer-title">{o.title}</div>
                    <div className="admin-offer-sub">{o.subtitle}</div>
                    {o.discount && <div className="admin-offer-discount">{o.discount}</div>}
                    <div className={`admin-offer-status ${o.active ? 'active' : 'inactive'}`}>
                      {o.active ? '● Active' : '○ Inactive'}
                    </div>
                  </div>
                  <div className="admin-offer-actions">
                    <button className="admin-btn-edit" onClick={() => openEditOffer(o)}>Edit</button>
                    <button className="admin-btn-delete" onClick={() => deleteOffer(o._id)}>Delete</button>
                  </div>
                </div>
              ))}
              {offers.length === 0 && (
                <div className="admin-empty-offers">No banners yet. Add your first promotional banner!</div>
              )}
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>User Management</h1>
                <p className="admin-subtitle">{users.length} registered users</p>
              </div>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">{u.fullName?.charAt(0).toUpperCase()}</div>
                          {u.fullName}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-badge ${u.isAdmin ? 'admin' : ''}`}>
                          {u.isAdmin ? '⚙ Admin' : 'User'}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-edit" onClick={() => openEditUser(u)}>Edit</button>
                          {u._id !== user.userId && (
                            <button className="admin-btn-delete" onClick={() => deleteUser(u._id)}>Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !usersLoading && (
                    <tr><td colSpan="5" className="admin-empty-row">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {editUser && (
              <Modal title={`Edit User: ${editUser.fullName}`} onClose={() => setEditUser(null)}>
                <form onSubmit={saveUser} className="admin-modal-form">
                  <div className="admin-field">
                    <label>Full Name</label>
                    <input value={userForm.fullName} onChange={e => setUserForm(f => ({ ...f, fullName: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>Email</label>
                    <input type="email" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} required />
                  </div>
                  <div className="admin-field">
                    <label>New Password (leave blank to keep)</label>
                    <input type="password" value={userForm.newPassword} onChange={e => setUserForm(f => ({ ...f, newPassword: e.target.value }))} placeholder="••••••••" />
                  </div>
                  <div className="admin-field admin-checkbox-field">
                    <label>
                      <input type="checkbox" checked={userForm.isAdmin} onChange={e => setUserForm(f => ({ ...f, isAdmin: e.target.checked }))} />
                      Grant Admin Role
                    </label>
                  </div>
                  {userMsg && <p className={userMsg.startsWith('✅') ? 'admin-success' : 'admin-error'}>{userMsg}</p>}
                  <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>Save Changes</button>
                </form>
              </Modal>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>Contact Messages</h1>
                <p className="admin-subtitle">{messages.length} messages received</p>
              </div>
            </div>

            {messagesLoading ? <div className="admin-loader">Loading messages…</div> : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Message</th><th>Date</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(m => (
                      <tr key={m._id}>
                        <td>{m.name}</td>
                        <td>{m.email}</td>
                        <td>{m.subject || 'No subject'}</td>
                        <td>
                          <select
                            value={m.status || 'unread'}
                            onChange={e => updateMessageStatus(m._id, e.target.value)}
                            className="admin-status-select"
                          >
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="responded">Responded</option>
                          </select>
                        </td>
                        <td style={{ maxWidth: '260px', wordWrap: 'break-word' }}>{m.message}</td>
                        <td>{new Date(m.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => deleteMessage(m._id)}
                            className="admin-delete-btn"
                            title="Delete message"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr><td colSpan="7" className="admin-empty-row">No messages yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* COUNTDOWN TIMERS */}
        {activeTab === 'countdown' && (
          <div>
            <div className="admin-section-header">
              <div>
                <h1>Countdown Timers</h1>
                <p className="admin-subtitle">Manage countdown timers for special events</p>
              </div>
              <button className="admin-btn-primary" onClick={openAddCountdown}>
                + Add Timer
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th><th>Description</th><th>End Time</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countdownTimers.map(timer => (
                    <tr key={timer._id}>
                      <td>{timer.title}</td>
                      <td>{timer.description || 'No description'}</td>
                      <td>{new Date(timer.endTime).toLocaleString()}</td>
                      <td>
                        <span className={`admin-status ${timer.isActive ? 'active' : 'inactive'}`}>
                          {timer.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            onClick={() => openEditCountdown(timer)}
                            className="admin-btn-edit"
                            title="Edit timer"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteCountdownTimer(timer._id)}
                            className="admin-btn-delete"
                            title="Delete timer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {countdownTimers.length === 0 && (
                    <tr><td colSpan="5" className="admin-empty-row">No countdown timers yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {prodModal && (
        <Modal title={editProduct ? 'Edit Product' : 'Add Product'} onClose={() => setProdModal(false)}>
          <form onSubmit={saveProduct} className="admin-modal-form">
            <div className="admin-field-row">
              <div className="admin-field">
                <label>Product ID (number)</label>
                <input type="number" value={prodForm.id} onChange={e => setProdForm(f => ({ ...f, id: e.target.value }))} required min="1" />
              </div>
              <div className="admin-field">
                <label>Series</label>
                <select value={prodForm.seriesKey} onChange={e => setProdForm(f => ({ ...f, seriesKey: e.target.value, series: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) }))} required>
                  <option value="">Select…</option>
                  {SERIES_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="admin-field">
              <label>Name</label>
              <input value={prodForm.name} onChange={e => setProdForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="admin-field">
              <label>Image Path (e.g. /Watch_Png/Classic Series/Classic1.png)</label>
              <input value={prodForm.image} onChange={e => setProdForm(f => ({ ...f, image: e.target.value }))} />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label>Price (e.g. $299.99)</label>
                <input value={prodForm.price} onChange={e => setProdForm(f => ({ ...f, price: e.target.value }))} required />
              </div>
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea rows="3" value={prodForm.description} onChange={e => setProdForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Specifications (one per line: Key: Value)</label>
              <textarea rows="6" value={prodForm.specifications} onChange={e => setProdForm(f => ({ ...f, specifications: e.target.value }))} placeholder="Movement Type: Quartz&#10;Case Diameter: 40mm" />
            </div>
            <div className="admin-field">
              <label>Colors (comma-separated)</label>
              <input value={prodForm.colors} onChange={e => setProdForm(f => ({ ...f, colors: e.target.value }))} placeholder="Black, Silver, Gold" />
            </div>
            <div className="admin-field">
              <label>Limited Edition label (e.g. 100/100)</label>
              <input value={prodForm.limited} onChange={e => setProdForm(f => ({ ...f, limited: e.target.value }))} />
            </div>
            <div className="admin-field admin-checkbox-field">
              <label>
                <input type="checkbox" checked={prodForm.inStock} onChange={e => setProdForm(f => ({ ...f, inStock: e.target.checked }))} />
                In Stock
              </label>
            </div>
            {prodMsg && <p className={prodMsg.startsWith('✅') ? 'admin-success' : 'admin-error'}>{prodMsg}</p>}
            <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>
              {editProduct ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </Modal>
      )}

      {/* Offer Modal */}
      {offModal && (
        <Modal title={editOffer ? 'Edit Banner' : 'Add Banner'} onClose={() => setOffModal(false)}>
          <form onSubmit={saveOffer} className="admin-modal-form">
            <div className="admin-field">
              <label>Title *</label>
              <input value={offForm.title} onChange={e => setOffForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="admin-field">
              <label>Subtitle</label>
              <input value={offForm.subtitle} onChange={e => setOffForm(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Description</label>
              <textarea rows="2" value={offForm.description} onChange={e => setOffForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Discount Label (e.g. "Up to 40% OFF")</label>
              <input value={offForm.discount} onChange={e => setOffForm(f => ({ ...f, discount: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Image URL</label>
              <input value={offForm.imageUrl} onChange={e => setOffForm(f => ({ ...f, imageUrl: e.target.value }))} />
            </div>
            <div className="admin-field-row">
              <div className="admin-field">
                <label>Button Text</label>
                <input value={offForm.buttonText} onChange={e => setOffForm(f => ({ ...f, buttonText: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label>Button Link</label>
                <input value={offForm.buttonLink} onChange={e => setOffForm(f => ({ ...f, buttonLink: e.target.value }))} />
              </div>
            </div>
            <div className="admin-field admin-checkbox-field">
              <label>
                <input type="checkbox" checked={offForm.active} onChange={e => setOffForm(f => ({ ...f, active: e.target.checked }))} />
                Active (visible in store)
              </label>
            </div>
            {offMsg && <p className={offMsg.startsWith('✅') ? 'admin-success' : 'admin-error'}>{offMsg}</p>}
            <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>
              {editOffer ? 'Update Banner' : 'Add Banner'}
            </button>
          </form>
        </Modal>
      )}

      {/* Countdown Timer Modal */}
      {countdownModal && (
        <Modal title={editCountdown ? 'Edit Countdown Timer' : 'Add Countdown Timer'} onClose={() => setCountdownModal(false)}>
          <form onSubmit={saveCountdownTimer} className="admin-modal-form">
            <div className="admin-field">
              <label>Title</label>
              <input
                value={countdownForm.title}
                onChange={e => setCountdownForm(f => ({ ...f, title: e.target.value }))}
                required
                placeholder="e.g., New Collection Launch"
              />
            </div>
            <div className="admin-field">
              <label>Description (optional)</label>
              <textarea
                value={countdownForm.description}
                onChange={e => setCountdownForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Additional details about the countdown..."
                rows="3"
              />
            </div>
            <div className="admin-field">
              <label>End Time</label>
              <input
                type="datetime-local"
                value={countdownForm.endTime}
                onChange={e => setCountdownForm(f => ({ ...f, endTime: e.target.value }))}
                required
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <div className="admin-field admin-checkbox-field">
              <label>
                <input
                  type="checkbox"
                  checked={countdownForm.isActive}
                  onChange={e => setCountdownForm(f => ({ ...f, isActive: e.target.checked }))}
                />
                Active (only one active timer shows at a time)
              </label>
            </div>
            {countdownMsg && <p className={countdownMsg.startsWith('Timer saved') ? 'admin-success' : 'admin-error'}>{countdownMsg}</p>}
            <button type="submit" className="admin-btn-primary" style={{ width: '100%' }}>
              {editCountdown ? 'Update Timer' : 'Add Timer'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Admin;
