import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ContactPage.css';

function ContactPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            setStatus('Error sending message. Please try again.');
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, padding: '10px', background: '#e45000', color: 'white', border: 'none', cursor: 'pointer' }}
            >
                Back
            </button>
            <div className="contact-page">
                <div className="contact-container">
                    <main className="main-content">
                        <div className="breadcrumbs">
                            Home <span>&gt;</span> Contact
                        </div>

                        <h1 className="page-title">Contact us</h1>

                        <h2 className="section-title">Find support by your purpose</h2>
                        <p className="support-description">Find contact details here.</p>

                        <div className="support-grid">
                            <div className="support-card">
                                <h3>&gt; Product Repair/Parts</h3>
                            </div>
                            <div className="support-card">
                                <h3>&gt; Technical Support</h3>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <p className="support-description">Find out where you can get your CHRONOS product repaired.</p>
                                <div className="support-card" style={{ marginTop: '10px' }}>
                                    <h3>&gt; Product Availability</h3>
                                </div>
                                <p className="support-description">CHRONOS products are available here.</p>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="support-description" style={{ marginTop: 0 }}>Still need help? Contact us over the internet.</p>
                            </div>
                        </div>

                        <div className="note-section">
                            <h4 className="note-title">Note</h4>
                            <ul className="note-list">
                                <li>English only acceptable.</li>
                                <li>For Cash Register & POS, <a href="/">click HERE</a>.</li>
                                <li>For Mobile information products, <a href="/">click HERE</a>.</li>
                                <li>For inquiry about personal information, <a href="/">click HERE</a>.</li>
                                <li>For inquiry about idea proposal, <a href="/">click HERE</a>.</li>
                            </ul>
                        </div>

                        <div className="corporate-office">
                            <h2 className="section-title">Corporate Office</h2>
                            <div className="office-city">
                                Odisha
                            </div>
                            <div className="office-address">
                                <p>Chronos India Co. Private Ltd.</p>
                                <p>Hostel No. 3, Silicon University, Patia</p>
                                <p>Bhubaneswar, Odisha 751024 India</p>
                                <p>Tel: +91 811-4611-204</p>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2 className="section-title">Send us a Message</h2>
                            <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 20px', background: '#e45000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                >
                                    Send Message
                                </button>
                                {status && <p style={{ marginTop: '10px', color: status.includes('success') ? 'green' : 'red' }}>{status}</p>}
                            </form>
                        </div>
                    </main>

                    <aside className="sidebar">
                        <div className="sidebar-header">
                            Support <span>&minus;</span>
                        </div>
                        <ul className="sidebar-menu">
                            <li><a href="/">FAQs (Frequently Asked Questions) <span>&gt;</span></a></li>
                            <li><a href="/">Manuals <span>&gt;</span></a></li>
                            <li><a href="/">Downloads <span>&gt;</span></a></li>
                            <li><a href="/">Computer OS compatibility <span>&gt;</span></a></li>
                            <li><a href="/">Smartphone compatibility <span>&gt;</span></a></li>
                            <li><a href="/">Video Tutorials <span>&gt;</span></a></li>
                            <li><a href="/">Warranty <span>&gt;</span></a></li>
                            <li><a href="/">Product Repair / Parts <span>&gt;</span></a></li>
                            <li><a href="/">Technical Support <span>&gt;</span></a></li>
                            <li><a href="/">Authorized Online Seller <span>&gt;</span></a></li>
                            <li><a href="/">CHRONOS International Warranty Network <span>&gt;</span></a></li>
                            <li><a href="/">Repair Status Checker <span>&gt;</span></a></li>
                        </ul>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
