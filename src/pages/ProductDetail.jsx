import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/ProductDetail.css';

function ProductDetail() {
  const { series, productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`http://localhost:5000/api/products?series=${series?.toLowerCase()}`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data)) { setError('Failed to load products.'); return; }
        const found = data.find(p => p.id === parseInt(productId));
        if (!found) { setError('Product not found.'); return; }
        setProduct(found);
        setSimilarProducts(data.filter(p => p.id !== parseInt(productId)));
      })
      .catch(() => setError('Cannot connect to server.'))
      .finally(() => setLoading(false));
  }, [series, productId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#888' }}>
        Loading product…
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-not-found">
        <h2>{error || 'Product not found'}</h2>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      series: product.seriesKey,
      price: parseFloat(String(product.price).replace(/[^0-9.]/g, '')),
      image: product.image,
    });
  };

  return (
    <div className="product-detail-container">
      <Breadcrumb />
      <div className="product-detail-wrapper">
        {/* Left Section — Image & Similar Products */}
        <div className="product-image-section">
          <div className="main-image-container">
            <img src={product.image} alt={product.name} className="main-image" />
          </div>
          <div className="image-info">
            <p className="series-badge">{product.series} Series</p>
            {product.limited && (
              <div className="limited-badge">Limited: {product.limited}</div>
            )}
          </div>

          {similarProducts.length > 0 && (
            <div className="similar-products-section">
              <h3>Similar Products</h3>
              <div className="similar-products-grid">
                {similarProducts.slice(0, 4).map((sp) => (
                  <div
                    key={sp._id}
                    className="similar-product-card"
                    onClick={() => navigate(`/product/${series}/${sp.id}`)}
                  >
                    <div className="similar-product-image">
                      <img src={sp.image} alt={sp.name} />
                    </div>
                    <h4>{sp.name}</h4>
                    <p className="similar-product-price">{sp.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Section — Details */}
        <div className="product-details-section">
          <h1 className="product-name">{product.name}</h1>


          <p className="product-description">{product.description}</p>

          <div className="price-section">
            <span className="product-price">{product.price}</span>
            {product.inStock
              ? <span className="in-stock">In Stock</span>
              : <span className="out-of-stock">Out of Stock</span>
            }
          </div>

          <button
            className="add-to-cart-btn-detail"
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="specifications-section">
              <h2>Specifications</h2>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warranty Info */}
          <div className="warranty-section">
            <h3>Warranty &amp; Support</h3>
            {product.specifications?.['Warranty'] && (
              <p>✓ {product.specifications['Warranty']} Manufacturer Warranty</p>
            )}
            <p>✓ Free international shipping on orders above $500</p>
            <p>✓ 30-day money-back guarantee</p>
            <p>✓ Lifetime technical support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
