import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, LogOut } from 'lucide-react';
import './App.css';
import SlidingDashboard from './SlidingDashboard.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import { useCart } from './CartContext';

function Home() {
    const navigate = useNavigate();
    const [dashboardOpen, setDashboardOpen] = useState(false);
    const [showProductMenu, setShowProductMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [userName, setUserName] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const { totalItems } = useCart();
    const userMenuTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        // Check if user is logged in
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');
        if (storedUserName) {
            setUserName(storedUserName);
            setUserRole(storedUserRole);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setUserName(null);
        setUserRole(null);
        setShowUserMenu(false);
        navigate('/');
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        
        if (query.trim().length === 0) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/items/search?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success && Array.isArray(data.data)) {
                setSearchResults(data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const closeSearchAndNavigate = (series, productId) => {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/product/${series}/${productId}`);
    };

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
                            <button className="nav-link-item" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit', padding: 0 }}>PRODUCTS</button>
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
                        <button onClick={() => navigate('/collections')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit', padding: 0 }}>STORE</button>
                        <button onClick={() => navigate('/our-story')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit', padding: 0 }}>ABOUT</button>
                    </nav>

                    <div className="nav-icons">
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search 
                                className="icon-hover" 
                                size={20} 
                                onClick={() => setShowSearch(!showSearch)}
                                style={{ cursor: 'pointer' }}
                            />
                            
                            {showSearch && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: '-100px',
                                    marginTop: '10px',
                                    background: '#fff',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    width: '350px',
                                    maxHeight: '400px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    zIndex: 1000
                                }}>
                                    {/* Search Input */}
                                    <div style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #eee',
                                        display: 'flex',
                                        gap: '8px',
                                        alignItems: 'center'
                                    }}>
                                        <Search size={18} style={{ color: '#666', flexShrink: 0 }} />
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            placeholder="Search watches..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Escape') {
                                                    setShowSearch(false);
                                                }
                                            }}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                border: 'none',
                                                outline: 'none',
                                                fontSize: '14px',
                                                padding: '4px 0',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    fontSize: '18px',
                                                    cursor: 'pointer',
                                                    color: '#999',
                                                    padding: 0,
                                                    flexShrink: 0
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {/* Search Results */}
                                    <div style={{
                                        overflowY: 'auto',
                                        padding: '0',
                                        flex: 1
                                    }}>
                                        {searchLoading && (
                                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 16px', fontSize: '14px' }}>
                                                Loading...
                                            </div>
                                        )}
                                        
                                        {!searchLoading && searchQuery.trim() === '' && (
                                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 16px', fontSize: '13px' }}>
                                                Start typing to search
                                            </div>
                                        )}
                                        
                                        {!searchLoading && searchQuery.trim() !== '' && searchResults.length === 0 && (
                                            <div style={{ textAlign: 'center', color: '#999', padding: '30px 16px', fontSize: '13px' }}>
                                                No products found
                                            </div>
                                        )}

                                        {searchResults.length > 0 && (
                                            <div>
                                                {searchResults.slice(0, 5).map((product) => (
                                                    <div
                                                        key={product._id}
                                                        onClick={() => closeSearchAndNavigate(product.category.toLowerCase(), product._id)}
                                                        style={{
                                                            display: 'flex',
                                                            gap: '12px',
                                                            padding: '12px 16px',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s',
                                                            borderBottom: '1px solid #f0f0f0',
                                                            alignItems: 'flex-start'
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        {product.image && (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                style={{
                                                                    width: '50px',
                                                                    height: '50px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px',
                                                                    flexShrink: 0
                                                                }}
                                                            />
                                                        )}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <h4 style={{
                                                                margin: '0 0 3px 0',
                                                                color: '#333',
                                                                fontSize: '13px',
                                                                fontWeight: '600',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}>
                                                                {product.name}
                                                            </h4>
                                                            <p style={{
                                                                margin: '0',
                                                                color: '#e45000',
                                                                fontSize: '12px',
                                                                fontWeight: '700'
                                                            }}>
                                                                ${product.price}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {searchResults.length > 5 && (
                                                    <div style={{
                                                        padding: '10px 16px',
                                                        textAlign: 'center',
                                                        color: '#e45000',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        borderTop: '1px solid #f0f0f0'
                                                    }}
                                                    onClick={() => setShowSearch(false)}
                                                    >
                                                        View all {searchResults.length} results
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {userName ? (
                            <div 
                                className="nav-item user-profile-wrapper"
                                onMouseEnter={() => {
                                    if (userMenuTimeoutRef.current) {
                                        clearTimeout(userMenuTimeoutRef.current);
                                    }
                                    setShowUserMenu(true);
                                }}
                                onMouseLeave={() => {
                                    userMenuTimeoutRef.current = setTimeout(() => {
                                        setShowUserMenu(false);
                                    }, 1000);
                                }}
                                style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                            >
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '4px 8px',
                                    borderRadius: '20px',
                                    transition: 'background-color 0.3s'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#e45000',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '12px'
                                    }}>
                                        {getInitials(userName)}
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#333' }}>{userName}</span>
                                </div>
                                
                                {showUserMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        background: '#fff',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        minWidth: '200px',
                                        zIndex: 1000,
                                        marginTop: '8px'
                                    }}>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderBottom: '1px solid #eee',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#333'
                                        }}>
                                            {userName}
                                        </div>
                                        {userRole === 'admin' && (
                                            <div 
                                                onClick={() => {
                                                    setShowUserMenu(false);
                                                    navigate('/admin-panel');
                                                }}
                                                style={{
                                                    padding: '10px 16px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    color: '#333',
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                            >
                                                Admin Panel
                                            </div>
                                        )}
                                        <div 
                                            onClick={handleLogout}
                                            style={{
                                                padding: '10px 16px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                color: '#e45000',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <User className="icon-hover" onClick={() => navigate('/register')} size={20} />
                        )}
                        
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
                    <button onClick={() => navigate('/collections')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', color: 'inherit', padding: 0 }}>View All →</button>
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
