import { Watch, Compass, Crown, Landmark, Gem, Award } from 'lucide-react';

function SlidingDashboard({ isOpen, toggleDashboard, onCollectionSelect }) {
  const collectionTypes = [
    { id: 1, name: 'Classic Series', icon: <Watch size={20} />, path: '/collections/classic' },
    { id: 2, name: 'Explorer Series', icon: <Compass size={20} />, path: '/collections/explorer' },
    { id: 3, name: 'Signature Series', icon: <Crown size={20} />, path: '/collections/signature' },
    { id: 4, name: 'Heritage Edition', icon: <Landmark size={20} />, path: '/collections/heritage' },
    { id: 5, name: 'Luxury Collection', icon: <Gem size={20} />, path: '/collections/luxury' },
    { id: 6, name: 'Limited Edition', icon: <Award size={20} />, path: '/collections/limited' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="dashboard-overlay" onClick={toggleDashboard}></div>
      )}

      {/* Sliding Dashboard */}
      <div className={`sliding-dashboard ${isOpen ? 'open' : ''}`}>
        <div className="dashboard-header">
          <h2>Collections</h2>
          <button className="close-btn" onClick={toggleDashboard}>✕</button>
        </div>

        <nav className="dashboard-nav">
          {collectionTypes.map((collection) => (
            <button
              key={collection.id}
              className="dashboard-item"
              onClick={() => {
                onCollectionSelect(collection);
                toggleDashboard();
              }}
            >
              <span className="collection-icon">{collection.icon}</span>
              <span className="collection-name">{collection.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

export default SlidingDashboard;
