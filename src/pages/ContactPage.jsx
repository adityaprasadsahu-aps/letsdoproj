import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ContactPage.css';
import Breadcrumb from '../components/Breadcrumb.jsx';

function ContactPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('Failed to send message. Please try again.');
            }
        } catch (error) {
            setStatus('Error sending message. Please try again.');
        }
    };

    return (
        <div>
            <div className="contact-page">
                <div className="contact-container">
                    <main className="main-content">
                        <Breadcrumb />

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
                        <div className="content-row">
                            <div className="content-column">
                                <p className="support-description">Find out where you can get your CHRONOS product repaired.</p>
                                <div className="support-card support-card-inline">
                                    <h3>&gt; Product Availability</h3>
                                </div>
                                <p className="support-description">CHRONOS products are available here.</p>
                            </div>
                            <div className="content-column">
                                <p className="support-description">Still need help? Contact us over the internet.</p>
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
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-field">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="subject">Subject:</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-field">
                                    <label htmlFor="message">Message:</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                    />
                                </div>
                                <button type="submit" className="submit-btn">
                                    Send Message
                                </button>
                                {status && <p className={`status-message ${status.includes('success') ? 'success' : 'error'}`}>{status}</p>}
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
