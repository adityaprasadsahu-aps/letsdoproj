import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/SeriesPage.css';

function NewArrivals() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Sort by createdAt descending to show newest first
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setWatches(sorted.slice(0, 12)); // Show latest 12
        } else setError('Failed to load products.');
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Floating Cart Button */}
      <button className="floating-cart-btn" onClick={() => navigate('/cart')}>
        <ShoppingBag size={22} />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <div className="collection-detail-container">
        <Breadcrumb />
        <div className="collection-detail-header">
          <h1>New Arrivals</h1>
          <p>Discover our latest timepieces</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
        )}

        {!loading && !error && watches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            No new arrivals at the moment. Check back soon!
          </div>
        )}

        {!loading && !error && (
          <div className="watches-grid">
            {watches.map((watch) => (
              <div
                key={watch._id}
                className="watch-card"
                onClick={() => navigate(`/product/${watch.seriesKey}/${watch.id}`)}
              >
                <div className="watch-image-placeholder">
                  <img
                    src={watch.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e0e0e0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EWatch Image%3C/text%3E%3C/svg%3E'}
                    alt={watch.name}
                  />
                </div>
                <h3>{watch.name}</h3>
                <p style={{ margin: '4px 0 8px', color: '#e45000', fontWeight: '600', fontSize: '15px' }}>{watch.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart({
                      id: watch.id,
                      name: watch.name,
                      series: watch.seriesKey,
                      price: parseFloat(String(watch.price).replace(/[^0-9.]/g, '')),
                      image: watch.image,
                    });
                  }}
                  disabled={!watch.inStock}
                >
                  {watch.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewArrivals;