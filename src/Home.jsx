import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag } from 'lucide-react';
import './App.css';
import SlidingDashboard from './SlidingDashboard.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { useCart } from './CartContext';

function Home() {
    const navigate = useNavigate();
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [showProductMenu, setShowProductMenu] = useState(false);
    const { totalItems } = useCart();

    const collections = [
        { name: 'Classic Series', path: '/collections/classic' },
        { name: 'Explorer Series', path: '/collections/explorer' },
        { name: 'Signature Series', path: '/collections/signature' },
        { name: 'Heritage Edition', path: '/collections/heritage' },
        { name: 'Luxury Collection', path: '/collections/luxury' },
        { name: 'Limited Edition', path: '/collections/limited' }
    ];

    return (
        <div className="App">
            <SlidingDashboard
                isOpen={dashboardOpen}
                toggleDashboard={() => setDashboardOpen(!dashboardOpen)}
                onCollectionSelect={(collection) => {
                    console.log('Selected collection:', collection);
                    navigate(collection.path);
                }}
            />

            <header>
                <div className="nav">
                    <button
                        className={`hamburger-btn ${dashboardOpen ? 'active' : ''}`}
                        onClick={() => setDashboardOpen(!dashboardOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div className="logo">CHRONOS</div>

                    <nav className="nav-links">
                        <div
                            className="nav-item"
                            onMouseEnter={() => setShowProductMenu(true)}
                            onMouseLeave={() => setShowProductMenu(false)}
                        >
                            <a href="#" className="nav-link-item">PRODUCTS</a>
                            {showProductMenu && (
                                <div className="dropdown-menu">
                                    {collections.map((collection, index) => (
                                        <div
                                            key={index}
                                            className="dropdown-item"
                                            onClick={() => {
                                                console.log(`Navigating to ${collection.name}`);
                                                setShowProductMenu(false);
                                                navigate(collection.path);
                                            }}
                                        >
                                            {collection.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <a href="#">STORE</a>
                        <a href="#">ABOUT</a>
                    </nav>

                    <div className="nav-icons">
                        <Search className="icon-hover" size={20} />
                        <User className="icon-hover" onClick={() => navigate('/register')} size={20} />
                        <div className="cart-icon-wrapper" onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <ShoppingBag className="icon-hover" size={20} />
                            {totalItems > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: '#e45000',
                                    color: '#fff',
                                    fontSize: '0.65em',
                                    fontWeight: '700',
                                    minWidth: '18px',
                                    height: '18px',
                                    borderRadius: '9px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 3px'
                                }}>{totalItems}</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <section className="hero">
                <video className="hero-video" autoPlay muted loop playsInline preload="auto">
                    <source src="/Luxury_Watch_Commercial_Video_Creation.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <small>THE SIGNATURE COLLECTION</small>
                    <h1>Timeless Precision</h1>
                    <p>
                        CHRONOS represents the pinnacle of watchmaking craftsmanship,
                        merging traditional techniques with modern aesthetics.
                    </p>
                    <button onClick={() => navigate('/collections')} className="btn">DISCOVER COLLECTION</button>
                </div>
            </section>
            <section className="section sale-section">
                <div className="sale-background" style={{ backgroundImage: 'url(/Watch_sales.png)' }}>
                    <div className="section-header">
                        <h2>Limited Time Sale</h2>
                        <p>Exclusive offers ending soon</p>
                    </div>
                    <div className="sale-container">
                        <div className="countdown-timer">
                            <CountdownTimer />
                        </div>
                        <div className="sale-content">
                            <h3>Premium Collections on Sale</h3>
                            <p>Save up to 40% on selected timepieces</p>
                            <button onClick={() => navigate('/collections')} className="btn">SHOP NOW</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="section-header">
                    <h2>Our Collections</h2>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/collections'); }}>View All →</a>
                </div>

                <div className="collection-grid">
                    <div
                        className="card"
                        onClick={() => navigate('/collections/classic')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/collections/classic'); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src="/Watch_Png/Classic Series/Classic1.png" alt="Classic Series" />
                        <div className="card-content">
                            <h3>Classic Series</h3>
                            <p>Minimal elegance crafted for everyday luxury.</p>
                        </div>
                    </div>

                    <div
                        className="card"
                        onClick={() => navigate('/collections/explorer')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/collections/explorer'); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src="/Watch_Png/Explorer Series/Explorer1.png" alt="Explorer Series" />
                        <div className="card-content">
                            <h3>Explorer Series</h3>
                            <p>Engineered for adventure and precision.</p>
                        </div>
                    </div>

                    <div
                        className="card"
                        onClick={() => navigate('/collections/signature')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter') navigate('/collections/signature'); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src="/Watch_Png/Signature Series/Signature2.png" alt="Signature Series" />
                        <div className="card-content">
                            <h3>Signature Series</h3>
                            <p>Our most iconic timepieces.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="footer-grid">
                    <div>
                        <h4>Products</h4>
                        <ul>
                            <li>Collections</li>
                            <li>New Arrivals</li>
                            <li>Compare</li>
                        </ul>
                    </div>

                    <div>
                        <h4 onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Support</h4>
                        <ul>
                            <li onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>FAQs</li>
                            <li onClick={() => navigate('/service-centers')} style={{ cursor: 'pointer' }}>Service Centers</li>
                            <li onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Warranty</li>
                        </ul>
                    </div>

                    <div>
                        <h4>Company</h4>
                        <ul>
                            <li onClick={() => navigate('/our-story')} style={{ cursor: 'pointer' }}>Our Story</li>
                            <li onClick={() => navigate('/sustainability')} style={{ cursor: 'pointer' }}>Sustainability</li>
                            <li onClick={() => navigate('/careers')} style={{ cursor: 'pointer' }}>Careers</li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact</h4>
                        <ul>
                            <li onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Get the latest news and updates.</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2026 CHRONOS WATCHES. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Home;
