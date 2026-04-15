import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/SeriesPage.css'; // Reuse the same CSS

const SERIES_OPTIONS = [
  { key: '', label: 'All Series' },
  { key: 'classic', label: 'Classic Series' },
  { key: 'explorer', label: 'Explorer Series' },
  { key: 'signature', label: 'Signature Series' },
  { key: 'heritage', label: 'Heritage Edition' },
  { key: 'luxury', label: 'Luxury Collection' },
  { key: 'limited', label: 'Limited Edition' },
];

function Store() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [watches, setWatches] = useState([]);
  const [filteredWatches, setFilteredWatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setWatches(data);
          setFilteredWatches(data);
        } else setError('Failed to load products.');
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = watches;
    if (selectedSeries) {
      filtered = filtered.filter(w => w.seriesKey === selectedSeries);
    }
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    } else {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredWatches(filtered);
  }, [watches, selectedSeries, sortBy]);

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
          <h1>Our Store</h1>
          <p>Discover all our timepieces</p>
        </div>

        {/* Filter Section */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <label htmlFor="series-filter" style={{ marginRight: '10px' }}>Filter by Series:</label>
            <select
              id="series-filter"
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              style={{ padding: '5px' }}
            >
              {SERIES_OPTIONS.map(option => (
                <option key={option.key} value={option.key}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort-filter" style={{ marginRight: '10px' }}>Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '5px' }}
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
        )}

        {!loading && !error && filteredWatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            No products match your filters.
          </div>
        )}

        {!loading && !error && (
          <div className="watches-grid">
            {filteredWatches.map((watch) => (
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

export default Store;