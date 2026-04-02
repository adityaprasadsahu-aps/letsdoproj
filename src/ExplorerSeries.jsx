import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from './CartContext';
import './collectionDetail.css';

function ExplorerSeries() {
  const navigate = useNavigate();
  const { addToCart, totalItems } = useCart();

  const watches = [
    { id: 1, name: 'Explorer Adventure', image: '/Watch_Png/Explorer Series/Explorer1.png', price: 449.99, series: 'Explorer Series' },
    { id: 2, name: 'Explorer Mountaineer', image: '/Watch_Png/Explorer Series/Explorer2.png', price: 499.99, series: 'Explorer Series' },
    { id: 3, name: 'Explorer Pathfinder', image: '/Watch_Png/Explorer Series/Explorer3.png', price: 429.99, series: 'Explorer Series' },
    { id: 4, name: 'Explorer Summit', image: '/Watch_Png/Explorer Series/Explorer4.png', price: 529.99, series: 'Explorer Series' },
    { id: 5, name: 'Explorer Nomad', image: '/Watch_Png/Explorer Series/Explorer5.png', price: 479.99, series: 'Explorer Series' },
    { id: 6, name: 'Explorer Voyager', image: '/Watch_Png/Explorer Series/Explorer6.png', price: 549.99, series: 'Explorer Series' },
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
          <h1>Explorer Series</h1>
          <p>Engineered for adventure and precision</p>
        </div>

        <div className="watches-grid">
          {watches.map((watch) => (
            <div key={watch.id} className="watch-card" onClick={() => navigate(`/product/explorer/${watch.id}`)}>
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

export default ExplorerSeries;
