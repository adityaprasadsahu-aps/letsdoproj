import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CompanyPages.css';

function Careers() {
    const navigate = useNavigate();
    return (
        <div className="company-page">
            <button
                className="company-back-btn"
                onClick={() => navigate('/')}
            >
                ← Back
            </button>

            {/* Hero Banner */}
            <div className="company-hero" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 50%, #1a1a2e 100%)' }}>
                <div className="company-hero-overlay"></div>
                <div className="company-hero-content">
                    <span className="company-hero-tag">JOIN OUR TEAM</span>
                    <h1>Careers</h1>
                    <p>Shape the future of horology with us</p>
                </div>
            </div>

            {/* Content */}
            <div className="company-content">
                {/* Why CHRONOS */}
                <section className="company-section">
                    <div className="company-section-badge">WHY CHRONOS</div>
                    <h2>More Than a Workplace</h2>
                    <div className="company-text-grid">
                        <div className="company-text-block">
                            <p>
                                At CHRONOS, you don't just build watches — you create lasting legacies.
                                We're a team of passionate artisans, engineers, designers, and
                                visionaries united by a shared love of precision and beauty.
                            </p>
                            <p>
                                We believe that the best ideas come from diverse perspectives.
                                Our teams span across Geneva, Tokyo, New York, and Mumbai,
                                bringing together talent from every corner of the world.
                            </p>
                        </div>
                        <div className="company-text-block">
                            <p>
                                Whether you're a master watchmaker with decades of experience or a
                                fresh graduate with bold ideas, CHRONOS offers an environment where
                                curiosity is celebrated and excellence is the standard.
                            </p>
                            <p>
                                We invest in our people — from continuous learning programs to
                                wellness initiatives — because we know that extraordinary timepieces
                                can only be made by extraordinary people.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="company-section company-section-dark">
                    <div className="company-section-badge">BENEFITS</div>
                    <h2>What We Offer</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">🎓</div>
                            <h3>Learning & Development</h3>
                            <p>Annual learning budget, access to world-class training programs, and mentorship from industry leaders.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🏥</div>
                            <h3>Health & Wellness</h3>
                            <p>Comprehensive health insurance, mental health support, gym memberships, and flexible wellness days.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🌍</div>
                            <h3>Global Mobility</h3>
                            <p>Opportunities to work across our global offices and experience different cultures and markets.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">⌚</div>
                            <h3>Employee Discount</h3>
                            <p>Exclusive discounts on CHRONOS timepieces and access to limited edition releases before the public.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🏠</div>
                            <h3>Flexible Working</h3>
                            <p>Hybrid work model with flexible hours designed around results, not rigid schedules.</p>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon">🌱</div>
                            <h3>Volunteer Days</h3>
                            <p>Paid volunteer days to support causes you care about through the CHRONOS Foundation.</p>
                        </div>
                    </div>
                </section>

                {/* Open Positions */}
                <section className="company-section">
                    <div className="company-section-badge">OPPORTUNITIES</div>
                    <h2>Open Positions</h2>
                    <div className="positions-list">
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Senior Watchmaker</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 Geneva, Switzerland</span>
                                    <span className="position-type">Full-time</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Product Designer</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 New York, USA</span>
                                    <span className="position-type">Full-time</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Marketing Manager — APAC</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 Tokyo, Japan</span>
                                    <span className="position-type">Full-time</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Quality Assurance Engineer</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 Geneva, Switzerland</span>
                                    <span className="position-type">Full-time</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Digital Experience Lead</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 Mumbai, India</span>
                                    <span className="position-type">Full-time / Hybrid</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                        <div className="position-card">
                            <div className="position-info">
                                <h3>Apprentice Watchmaker</h3>
                                <div className="position-meta">
                                    <span className="position-location">📍 Geneva, Switzerland</span>
                                    <span className="position-type">Apprenticeship — 3 years</span>
                                </div>
                            </div>
                            <button className="position-apply-btn">Apply →</button>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="company-section company-section-cta" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)' }}>
                    <h2>Don't See Your Role?</h2>
                    <p>We're always looking for exceptional talent. Send us your resume and we'll keep you in mind for future opportunities.</p>
                    <button className="company-cta-btn" onClick={() => navigate('/contact')}>
                        GET IN TOUCH
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Careers;
