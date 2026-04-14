import { useNavigate } from 'react-router-dom';
import '../styles/CollectionPage.css';

function CollectionPage() {
  const navigate = useNavigate();
  const collections = [
    {
      id: 1,
      name: 'Classic Series',
      image: '/Watch_Png/Classic Series/Classic1.png',
      description: 'Minimal elegance crafted for everyday luxury.',
      price: '$2,499',
      path: '/collections/classic'
    },
    {
      id: 2,
      name: 'Explorer Series',
      image: '/Watch_Png/Explorer Series/Explorer1.png',
      description: 'Engineered for adventure and precision.',
      price: '$3,299',
      path: '/collections/explorer'
    },
    {
      id: 3,
      name: 'Signature Series',
      image: '/Watch_Png/Signature Series/Signature2.png',
      description: 'Our most iconic timepieces.',
      price: '$4,499',
      path: '/collections/signature'
    },
    {
      id: 4,
      name: 'Heritage Edition',
      image: '/Watch_Png/Heritage Series/Heritage1.png',
      description: 'Vintage inspired designs with modern craftsmanship.',
      price: '$2,899',
      path: '/collections/heritage'
    },
    {
      id: 5,
      name: 'Luxury Collection',
      image: '/Watch_Png/Luxury Series/Luxury1.png',
      description: 'Premium materials and exclusive designs.',
      price: '$5,999',
      path: '/collections/luxury'
    },
    {
      id: 6,
      name: 'Limited Edition',
      image: '/Watch_Png/Limited Series/Limited3.png',
      description: 'Rare and exclusive pieces for collectors.',
      price: '$7,299',
      path: '/collections/limited'
    },
  ];

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
      >
        Back
      </button>
      <div className="collection-page-container">
        <div className="collection-header">
          <h1>Our Collections</h1>
          <p>Discover the finest timepieces from CHRONOS</p>
        </div>

        <div className="collection-items">
          {collections.map((item) => (
            <div key={item.id} className="collection-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="item-footer">
                  <button className="view-btn" onClick={() => navigate(item.path)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
