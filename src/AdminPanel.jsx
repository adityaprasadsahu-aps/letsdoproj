import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Gift, Clock, Plus } from 'lucide-react';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/user/${userEmail}`);
        const data = await response.json();

        if (data.success) {
          setUserRole(data.data.role);
          setUserName(data.data.fullName);

          if (data.data.role !== 'admin') {
            navigate('/');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (loading) {
    return <div className="admin-panel-container"><p>Loading...</p></div>;
  }

  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="admin-panel-container">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {userName}!</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="admin-options-grid">
        {/* Add Item Card */}
        <div
          className="admin-card"
          onClick={() => navigate('/admin/add-item')}
        >
          <div className="card-icon plus-icon">
            <Plus size={40} />
          </div>
          <h3>Add Item</h3>
          <p>Add new watches to the database</p>
          <button className="card-btn">Go to Add Item →</button>
        </div>

        {/* Manage Discounts Card */}
        <div
          className="admin-card"
          onClick={() => navigate('/admin/manage-discounts')}
        >
          <div className="card-icon gift-icon">
            <Gift size={40} />
          </div>
          <h3>Manage Discounts</h3>
          <p>Create and manage item discounts</p>
          <button className="card-btn">Go to Discounts →</button>
        </div>

        {/* Sales Time Card */}
        <div
          className="admin-card"
          onClick={() => navigate('/admin/manage-sales-time')}
        >
          <div className="card-icon clock-icon">
            <Clock size={40} />
          </div>
          <h3>Sales Time</h3>
          <p>Change the limited time sale duration</p>
          <button className="card-btn">Go to Sales Time →</button>
        </div>
      </div>

      <div className="admin-footer">
        <p>📌 Tip: Use these options to manage your store efficiently</p>
      </div>
    </div>
  );
}

export default AdminPanel;
