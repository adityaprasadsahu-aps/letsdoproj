import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import './collectionDetail.css';

function LuxurySeries() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();

  const watches = [
    { id: 1, name: 'Luxury Royal', image: '/Watch_Png/Luxury Series/Luxury1.png', price: 1299.99, series: 'Luxury Series' },
    { id: 2, name: 'Luxury Diamond', image: '/Watch_Png/Luxury Series/Luxury2.png', price: 1599.99, series: 'Luxury Series' },
    { id: 3, name: 'Luxury Perpetual', image: '/Watch_Png/Luxury Series/Luxury3.png', price: 1399.99, series: 'Luxury Series' },
    { id: 4, name: 'Luxury Celestial', image: '/Watch_Png/Luxury Series/Luxury4.png', price: 1699.99, series: 'Luxury Series' },
    { id: 5, name: 'Luxury Empress', image: '/Watch_Png/Luxury Series/Luxury5.png', price: 1499.99, series: 'Luxury Series' },
    { id: 6, name: 'Luxury Regalia', image: '/Watch_Png/Luxury Series/Luxury6.png', price: 1899.99, series: 'Luxury Series' },
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
          <h1>Luxury Collection</h1>
          <p>Premium materials and exclusive designs</p>
        </div>

        <div className="watches-grid">
          {watches.map((watch) => (
            <div key={watch.id} className="watch-card" onClick={() => navigate(`/product/luxury/${watch.id}`)}>
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

export default LuxurySeries;
