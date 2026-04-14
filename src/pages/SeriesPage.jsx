import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import '../styles/SeriesPage.css';

const SERIES_META = {
  classic:   { label: 'Classic Series',    subtitle: 'Minimal elegance crafted for everyday luxury' },
  explorer:  { label: 'Explorer Series',   subtitle: 'Engineered for adventure and precision' },
  signature: { label: 'Signature Series',  subtitle: 'Our most iconic timepieces' },
  heritage:  { label: 'Heritage Edition',  subtitle: 'Timeless design honouring watchmaking tradition' },
  luxury:    { label: 'Luxury Collection', subtitle: 'Supreme craftsmanship and precious materials' },
  limited:   { label: 'Limited Edition',   subtitle: 'Rare, numbered collector pieces' },
};

function SeriesPage({ seriesKey }) {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [watches, setWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const meta = SERIES_META[seriesKey] || { label: seriesKey, subtitle: '' };

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:5000/api/products?series=${seriesKey}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setWatches(data);
        else setError('Failed to load products.');
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, [seriesKey]);

  return (
    <div>
      <button
        onClick={() => navigate('/collections')}
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
      >
        Back to Collections
      </button>

      {/* Floating Cart Button */}
      <button className="floating-cart-btn" onClick={() => navigate('/cart')}>
        <ShoppingBag size={22} />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <div className="collection-detail-container">
        <div className="collection-detail-header">
          <h1>{meta.label}</h1>
          <p>{meta.subtitle}</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
        )}

        {!loading && !error && watches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            No products in this series yet. Check back soon!
          </div>
        )}

        {!loading && !error && (
          <div className="watches-grid">
            {watches.map((watch) => (
              <div
                key={watch._id}
                className="watch-card"
                onClick={() => navigate(`/product/${seriesKey}/${watch.id}`)}
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

export default SeriesPage;
