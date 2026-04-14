import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import '../styles/SeriesPage.css';

function SearchPage() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllProducts(data);
        } else setError('Failed to load products.');
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.series.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    }
  }, [query, allProducts]);

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
      >
        Back to Home
      </button>

      {/* Floating Cart Button */}
      <button className="floating-cart-btn" onClick={() => navigate('/cart')}>
        <ShoppingBag size={22} />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <div className="collection-detail-container">
        <div className="collection-detail-header">
          <h1>Search Products</h1>
          <div style={{ marginTop: '20px', maxWidth: '400px' }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                placeholder="Search watches..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#ef4444' }}>{error}</div>
        )}

        {!loading && !error && query.trim() === '' && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            Enter a search term to find products.
          </div>
        )}

        {!loading && !error && query.trim() !== '' && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            No products found matching "{query}".
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="watches-grid">
            {results.map((watch) => (
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

export default SearchPage;