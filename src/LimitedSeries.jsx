import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import './collectionDetail.css';

function LimitedSeries() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();

  const watches = [
    { id: 1, name: 'Limited Centurion', image: '/Watch_Png/Limited Series/Limited1.png', price: 899.99, series: 'Limited Series' },
    { id: 2, name: 'Limited Phoenix', image: '/Watch_Png/Limited Series/Limited2.png', price: 949.99, series: 'Limited Series' },
    { id: 3, name: 'Limited Dragon', image: '/Watch_Png/Limited Series/Limited3.png', price: 999.99, series: 'Limited Series' },
    { id: 4, name: 'Limited Eclipse', image: '/Watch_Png/Limited Series/Limited4.png', price: 1049.99, series: 'Limited Series' },
    { id: 5, name: 'Limited Nebula', image: '/Watch_Png/Limited Series/Limited5.png', price: 1099.99, series: 'Limited Series' },
    { id: 6, name: 'Limited Chronos', image: '/Watch_Png/Limited Series/Limited6.png', price: 1199.99, series: 'Limited Series' },
  ];

  const handleAddToCart = async (watch) => {
    const userId = localStorage.getItem('userEmail') || 'guest';
    try {
      addToCart(watch);
      const response = await fetch('http://localhost:5000/api/cartitems/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId: watch.id, name: watch.name, price: watch.price, quantity: 1, image: watch.image, category: watch.series })
      });
      const data = await response.json();
      if (!data.success) console.error('Failed to save to database:', data.message);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

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
          <h1>Limited Edition</h1>
          <p>Rare and exclusive pieces for collectors</p>
        </div>

        <div className="watches-grid">
          {watches.map((watch) => (
            <div key={watch.id} className="watch-card" onClick={() => navigate(`/product/limited/${watch.id}`)}>
              <div className="watch-image-placeholder">
                <img src={watch.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e0e0e0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EWatch Image%3C/text%3E%3C/svg%3E'} alt={watch.name} />
              </div>
              <h3>{watch.name}</h3>
              <button
                className="add-to-cart-btn"
                onClick={(e) => { e.stopPropagation(); handleAddToCart(watch); }}
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

export default LimitedSeries;
