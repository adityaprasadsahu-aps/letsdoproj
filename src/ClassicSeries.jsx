import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import './collectionDetail.css';

function ClassicSeries() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();
  
  const watches = [
    { id: 1, name: 'Classic Minimalist', image: '/Watch_Png/Classic Series/Classic1.png', price: 299.99, series: 'Classic Series' },
    { id: 2, name: 'Classic Elegant', image: '/Watch_Png/Classic Series/Classic2.png', price: 349.99, series: 'Classic Series' },
    { id: 3, name: 'Classic Refined', image: '/Watch_Png/Classic Series/Classic3.png', price: 329.99, series: 'Classic Series' },
    { id: 4, name: 'Classic Heritage', image: '/Watch_Png/Classic Series/Classic4.png', price: 369.99, series: 'Classic Series' },
    { id: 5, name: 'Classic Timeless', image: '/Watch_Png/Classic Series/Classic5.png', price: 319.99, series: 'Classic Series' },
    { id: 6, name: 'Classic Sophisticated', image: '/Watch_Png/Classic Series/Classic6.png', price: 389.99, series: 'Classic Series' },
  ];

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
          <h1>Classic Series</h1>
          <p>Minimal elegance crafted for everyday luxury</p>
        </div>

        <div className="watches-grid">
          {watches.map((watch) => (
            <div key={watch.id} className="watch-card" onClick={() => navigate(`/product/classic/${watch.id}`)}>
              <div className="watch-image-placeholder">
                <img src={watch.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e0e0e0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EWatch Image%3C/text%3E%3C/svg%3E'} alt={watch.name} />
              </div>
              <h3>{watch.name}</h3>
              <button
                className="add-to-cart-btn"
                onClick={(e) => { e.stopPropagation(); addToCart(watch); }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClassicSeries;
