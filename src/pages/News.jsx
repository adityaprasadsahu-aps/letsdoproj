import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function News() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="company-page">
      <Breadcrumb />

      <div className="company-content">
        <h1>News & Updates</h1>
        <p>
          Stay informed about our latest collections, exclusive offers, and watchmaking insights.
          Subscribe to our newsletter for the latest news and updates.
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubscribe} style={{ marginTop: '30px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#e45000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Subscribe
              </button>
            </div>
          </form>
        ) : (
          <div style={{ marginTop: '30px', padding: '20px', background: '#f0f0f0', borderRadius: '10px' }}>
            <h3>Thank you for subscribing!</h3>
            <p>You'll receive our latest news and updates via email.</p>
          </div>
        )}

        <h2 style={{ marginTop: '40px' }}>Latest News</h2>
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h3>New Limited Edition Collection</h3>
            <p>Introducing our exclusive limited edition watches, available for a short time only.</p>
            <small>Posted on April 15, 2026</small>
          </div>
          <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h3>Sustainability Initiatives</h3>
            <p>Learn about our commitment to sustainable watchmaking practices.</p>
            <small>Posted on April 10, 2026</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;