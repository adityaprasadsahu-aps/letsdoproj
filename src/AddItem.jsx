import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './additem.css';

function AddItem() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is admin
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      alert('Access Denied! Only admin can add items.');
      navigate('/');
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Item name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
      isValid = false;
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "Stock quantity is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        console.log('Adding item:', formData);

        const response = await fetch('http://localhost:5000/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            image: formData.image,
            category: formData.category,
            stock: parseInt(formData.stock)
          })
        });

        const data = await response.json();
        console.log('Add item response:', data);

        if (data.success) {
          setSuccessMessage('Item added successfully!');
          setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: '',
            stock: ''
          });
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        } else {
          alert(data.message || 'Failed to add item!');
        }
      } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item! Please try again.');
      }
    }
  };

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
      >
        Back
      </button>
      <div className="additem-container">
        <div className="additem-card">
          <h2 className="additem-title">Add New Item</h2>
          <p className="additem-subtitle">Admin Only - Add products to inventory</p>

          {successMessage && (
            <div style={{ 
              backgroundColor: '#4CAF50', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '4px', 
              marginBottom: '15px',
              textAlign: 'center'
            }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="additem-form">
            <div className="form-group">
              <label htmlFor="name">Item Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Luxury Automatic Watch"
                required
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed product description"
                rows="4"
                required
              ></textarea>
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., 5000"
                  step="0.01"
                  required
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  required
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Classic">Classic</option>
                  <option value="Explorer">Explorer</option>
                  <option value="Signature">Signature</option>
                  <option value="Heritage">Heritage</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Limited Edition">Limited Edition</option>
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="e.g., watch1.jpg"
                />
              </div>
            </div>

            <button type="submit" className="submit-btn-primary">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
