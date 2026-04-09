import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';

function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
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

    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5002/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });

            const data = await response.json();

            if (!response.ok) {
                setApiError(data.error || 'Login failed. Please try again.');
            } else {
                login(data.userId, data.fullName);  // store in AuthContext + localStorage
                navigate('/');
            }
        } catch (err) {
            setApiError('Cannot connect to server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
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

                                {apiError && (
                                    <p style={{ color: 'red', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>
                                        ⚠️ {apiError}
                                    </p>
                                )}

                                <button type="submit" className="submit-btn-primary" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
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
