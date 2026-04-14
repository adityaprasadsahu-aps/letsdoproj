import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';

function RegistrationForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

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

        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters, include a letter and a number";
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords don't match!";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.error || 'Registration failed. Please try again.');
            } else {
                alert('Registration Successful! Please log in.');
                navigate('/login');
            }
        } catch (err) {
            setApiError('Cannot connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
            >
                Back
            </button>
            <div className="registration-container">
                <div className="registration-card">
                    <h2 className="registration-title">Create Your Account</h2>
                    <p className="registration-subtitle">Join us tonight</p>

                    <form onSubmit={handleSubmit} className="registration-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Aditya Prasad Sahu"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="aditya@example.com"
                                required
                            />
                            {errors.email && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                            {errors.confirmPassword && <span className="error-text" style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword}</span>}
                        </div>

                        {apiError && (
                            <p style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>
                                ⚠️ {apiError}
                            </p>
                        )}

                        <button type="submit" className="submit-btn-primary" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="login-link">
                        Already have an account? <button type="button" className="link-button" onClick={(e) => {
                            e.preventDefault();
                            navigate('/login');
                        }}>Log in</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegistrationForm;
