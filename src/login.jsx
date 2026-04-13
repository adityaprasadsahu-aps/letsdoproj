import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const loginUser = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (data.success) {
                    localStorage.setItem('userEmail', data.data.email);
                    localStorage.setItem('userRole', data.data.role);
                    localStorage.setItem('userName', data.data.fullName);
                    
                    if (data.data.role === 'admin') {
                        alert('Admin Login Successful!');
                        navigate('/admin-panel');
                    } else {
                        alert('Login Successful!');
                        navigate('/');
                    }
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('Login error. Please try again.');
            }
        };

        loginUser();
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        console.log('Password reset requested for:', resetEmail);
        setResetSent(true);
    };

    const backToLogin = () => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail('');
    };

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px' }}
            >
                Back
            </button>
            <div className="login-container">
                <div className="login-card">
                    {!showForgotPassword ? (
                        <>
                            <h2 className="login-title">Welcome Back</h2>
                            <p className="login-subtitle">Sign in to your account</p>

                            <form onSubmit={handleSubmit} className="login-form">
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
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="********"
                                        required
                                    />
                                </div>

                                <div className="forgot-password">
                                    <button type="button" className="link-button" onClick={() => setShowForgotPassword(true)}>
                                        Forgot Password?
                                    </button>
                                </div>

                                <button type="submit" className="submit-btn-primary">
                                    Sign In
                                </button>
                            </form>

                            <p className="register-link">
                                Don't have an account? <button type="button" className="link-button" onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}>Sign up</button>
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="login-title">Reset Password</h2>
                            <p className="login-subtitle">Enter your email to receive a reset link</p>

                            {!resetSent ? (
                                <form onSubmit={handleResetPassword} className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="resetEmail">Email Address</label>
                                        <input
                                            type="email"
                                            id="resetEmail"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="aditya@example.com"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="submit-btn-primary">
                                        Send Reset Link
                                    </button>
                                </form>
                            ) : (
                                <div className="reset-success">
                                    <p>✅ A password reset link has been sent to <strong>{resetEmail}</strong></p>
                                    <p>Please check your inbox.</p>
                                </div>
                            )}

                            <p className="register-link">
                                <button type="button" className="link-button" onClick={backToLogin}>
                                    ← Back to Login
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
