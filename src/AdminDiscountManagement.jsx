import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus } from 'lucide-react';
import './AdminDiscountManagement.css';

function AdminDiscountManagement() {
  const [discounts, setDiscounts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    itemId: '',
    discountPercentage: '',
    durationHours: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch discounts and items
  useEffect(() => {
    fetchDiscounts();
    fetchItems();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/discount/all');
      const data = await response.json();

      if (data.success) {
        setDiscounts(data.data);
        setError('');
      } else {
        setError('Failed to fetch discounts');
      }
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Error loading discounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/items');
      const data = await response.json();

      if (data.success) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();

    if (!formData.itemId || !formData.discountPercentage || !formData.durationHours) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: formData.itemId,
          discountPercentage: parseInt(formData.discountPercentage),
          durationHours: parseInt(formData.durationHours)
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Discount added successfully!');
        setFormData({ itemId: '', discountPercentage: '', durationHours: '' });
        setShowForm(false);
        fetchDiscounts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to add discount');
      }
    } catch (err) {
      console.error('Error adding discount:', err);
      setError('Error adding discount');
    }
  };

  const handleUpdateDiscount = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/discount/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discountPercentage: formData.discountPercentage ? parseInt(formData.discountPercentage) : undefined,
          durationHours: formData.durationHours ? parseInt(formData.durationHours) : undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Discount updated successfully!');
        setFormData({ itemId: '', discountPercentage: '', durationHours: '' });
        setEditingId(null);
        setShowForm(false);
        fetchDiscounts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Failed to update discount');
      }
    } catch (err) {
      console.error('Error updating discount:', err);
      setError('Error updating discount');
    }
  };

  const handleEditClick = (discount) => {
    setEditingId(discount._id);
    setFormData({
      itemId: discount.itemId?._id || '',
      discountPercentage: discount.discountPercentage,
      durationHours: ''
    });
    setShowForm(true);
  };

  const handleDeleteDiscount = async (discountId) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/discount/${discountId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Discount deleted successfully!');
        fetchDiscounts();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to delete discount');
      }
    } catch (err) {
      console.error('Error deleting discount:', err);
      setError('Error deleting discount');
    }
  };

  const handleDeactivate = async (discountId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/discount/${discountId}/deactivate`, {
        method: 'PUT'
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Discount deactivated!');
        fetchDiscounts();
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error deactivating discount:', err);
      setError('Error deactivating discount');
    }
  };

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return <div className="admin-discount-container"><p>Loading...</p></div>;
  }

  return (
    <div className="admin-discount-container">
      <div className="admin-discount-header">
        <h1>Discount Management</h1>
        <button 
          className="add-discount-btn"
          onClick={() => {
            setEditingId(null);
            setFormData({ itemId: '', discountPercentage: '', durationHours: '' });
            setShowForm(!showForm);
          }}
        >
          <Plus size={20} /> Add Discount
        </button>
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

      {showForm && (
        <div className="discount-form-container">
          <h2>{editingId ? 'Edit Discount' : 'Add New Discount'}</h2>
          <form onSubmit={editingId ? handleUpdateDiscount : handleAddDiscount} className="discount-form">
            {!editingId && (
              <div className="form-group">
                <label>Select Item:</label>
                <select 
                  name="itemId" 
                  value={formData.itemId} 
                  onChange={handleInputChange}
                  required={!editingId}
                >
                  <option value="">-- Choose an item --</option>
                  {items.map(item => (
                    <option key={item._id} value={item._id}>
                      {item.name} (${item.price})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Discount Percentage (%):</label>
              <input 
                type="number" 
                name="discountPercentage" 
                value={formData.discountPercentage} 
                onChange={handleInputChange}
                min="1"
                max="100"
                placeholder="e.g., 20"
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (Hours):</label>
              <input 
                type="number" 
                name="durationHours" 
                value={formData.durationHours} 
                onChange={handleInputChange}
                min="1"
                placeholder="e.g., 48"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Discount' : 'Add Discount'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ itemId: '', discountPercentage: '', durationHours: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="discounts-list">
        <h2>Active Discounts ({discounts.filter(d => d.isActive).length})</h2>
        
        {discounts.length === 0 ? (
          <p className="no-discounts">No discounts yet. Add one to get started!</p>
        ) : (
          <div className="discounts-table-wrapper">
            <table className="discounts-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Original Price</th>
                  <th>Discount %</th>
                  <th>Discounted Price</th>
                  <th>Time Left</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(discount => {
                  const item = discount.itemId;
                  const discountedPrice = item ? (item.price * (1 - discount.discountPercentage / 100)).toFixed(2) : 'N/A';
                  const timeLeft = calculateTimeLeft(discount.endTime);
                  
                  return (
                    <tr key={discount._id} className={!discount.isActive ? 'inactive-row' : ''}>
                      <td className="item-name">{item?.name || 'Unknown Item'}</td>
                      <td>${item?.price.toFixed(2) || 'N/A'}</td>
                      <td className="discount-percent">{discount.discountPercentage}%</td>
                      <td className="discount-price">${discountedPrice}</td>
                      <td className={timeLeft === 'Expired' ? 'expired' : 'time-left'}>
                        {timeLeft}
                      </td>
                      <td>
                        <span className={`status-badge ${discount.isActive ? 'active' : 'inactive'}`}>
                          {discount.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions">
                        {discount.isActive && (
                          <>
                            <button 
                              className="action-btn edit-btn"
                              onClick={() => handleEditClick(discount)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="action-btn deactivate-btn"
                              onClick={() => handleDeactivate(discount._id)}
                              title="Deactivate"
                            >
                              Deactivate
                            </button>
                          </>
                        )}
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDeleteDiscount(discount._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDiscountManagement;
