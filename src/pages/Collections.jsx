import { useNavigate } from 'react-router-dom';
import '../styles/CompanyPages.css';

function Collections() {
  const navigate = useNavigate();

  const collections = [
    { name: 'Classic Series', path: '/collections/classic', description: 'Minimal elegance crafted for everyday luxury' },
    { name: 'Explorer Series', path: '/collections/explorer', description: 'Engineered for adventure and precision' },
    { name: 'Signature Series', path: '/collections/signature', description: 'Our most iconic timepieces' },
    { name: 'Heritage Edition', path: '/collections/heritage', description: 'Timeless design honouring watchmaking tradition' },
    { name: 'Luxury Collection', path: '/collections/luxury', description: 'Supreme craftsmanship and precious materials' },
    { name: 'Limited Edition', path: '/collections/limited', description: 'Rare, numbered collector pieces' },
  ];

  return (
    <div className="company-page">
      <button
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
      >
        Back to Home
      </button>

      <div className="company-content">
        <h1>Our Collections</h1>
        <p>Explore our diverse range of watch collections, each crafted with precision and passion.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
          {collections.map((collection, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => navigate(collection.path)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
              <button style={{ marginTop: '10px', padding: '8px 16px', background: '#e45000', color: 'white', border: 'none', borderRadius: '5px' }}>
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;