import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AdminSalesTimeManagement.css';

function AdminSalesTimeManagement() {
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    durationDays: '',
    discount: '',
    endDate: ''
  });

  useEffect(() => {
    fetchSaleInfo();
  }, []);

  const fetchSaleInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/sale/current');
      const data = await response.json();

      if (data.success && data.data) {
        setSale(data.data);
        const endDate = new Date(data.data.endTime);
        setFormData({
          title: data.data.title,
          discount: data.data.discount,
          endDate: endDate.toISOString().split('T')[0],
          durationDays: ''
        });
        setError('');
      }
    } catch (err) {
      console.error('Error fetching sale:', err);
      setError('Failed to load sale information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExtendSale = async (e) => {
    e.preventDefault();

    if (!formData.durationDays) {
      setError('Please enter number of days to extend');
      return;
    }

    try {
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + parseInt(formData.durationDays));

      const response = await fetch('http://localhost:5000/api/sale/update-end-time', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endTime: newEndDate.toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`Sale extended by ${formData.durationDays} days!`);
        setFormData(prev => ({ ...prev, durationDays: '' }));
        fetchSaleInfo();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to extend sale');
      }
    } catch (err) {
      console.error('Error extending sale:', err);
      setError('Error updating sale time');
    }
  };

  const handleSetCustomDate = async (e) => {
    e.preventDefault();

    if (!formData.endDate) {
      setError('Please select an end date');
      return;
    }

    try {
      const selectedDate = new Date(formData.endDate);
      selectedDate.setHours(23, 59, 59);

      const response = await fetch('http://localhost:5000/api/sale/update-end-time', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endTime: selectedDate.toISOString()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Sale time updated successfully!');
        fetchSaleInfo();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update sale time');
      }
    } catch (err) {
      console.error('Error updating sale:', err);
      setError('Error updating sale time');
    }
  };

  if (loading) {
    return <div className="admin-sales-container"><p>Loading...</p></div>;
  }

  const calculateTimeLeft = () => {
    if (!sale) return 'N/A';
    const now = new Date();
    const end = new Date(sale.endTime);
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="admin-sales-container">
      <button className="back-btn" onClick={() => navigate('/admin-panel')}>
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="admin-sales-header">
        <h1>Limited Time Sale Management</h1>
        <p>Control the countdown timer shown on your homepage</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError('')}>&times;</button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
          <button onClick={() => setSuccessMessage('')}>&times;</button>
        </div>
      )}

      {sale && (
        <div className="sales-info-card">
          <h2>Current Sale Status</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Sale Title:</label>
              <p>{sale.title}</p>
            </div>
            <div className="info-item">
              <label>Discount:</label>
              <p>{sale.discount}% Off</p>
            </div>
            <div className="info-item">
              <label>Current Time Left:</label>
              <p className="time-left">{calculateTimeLeft()}</p>
            </div>
            <div className="info-item">
              <label>End Date & Time:</label>
              <p>{new Date(sale.endTime).toLocaleString()}</p>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <p className={`status ${sale.isActive ? 'active' : 'inactive'}`}>
                {sale.isActive ? '🟢 Active' : '🔴 Inactive'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="forms-container">
        {/* Extend Sale Form */}
        <div className="form-section">
          <h2>Extend Sale Duration</h2>
          <p className="form-description">Add more days to the current sale</p>
          <form onSubmit={handleExtendSale} className="sales-form">
            <div className="form-group">
              <label>Number of Days to Add:</label>
              <input
                type="number"
                name="durationDays"
                value={formData.durationDays}
                onChange={handleInputChange}
                placeholder="e.g., 7"
                min="1"
                max="365"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Extend Sale
            </button>
          </form>
        </div>

        {/* Set Custom Date Form */}
        <div className="form-section">
          <h2>Set Custom End Date</h2>
          <p className="form-description">Choose a specific date and time for sale to end</p>
          <form onSubmit={handleSetCustomDate} className="sales-form">
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update End Date
            </button>
          </form>
        </div>
      </div>

      <div className="info-box">
        <h3>💡 How it works:</h3>
        <ul>
          <li>The countdown timer on your home page automatically shows the time remaining</li>
          <li>When you extend the sale, the timer updates immediately for all visitors</li>
          <li>You can set a custom end date and time using the form above</li>
          <li>The sale will automatically mark as inactive when time expires</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSalesTimeManagement;
