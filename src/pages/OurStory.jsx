import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CompanyPages.css';

function OurStory() {
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
            <div className="company-hero" style={{ backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }}>
                <div className="company-hero-overlay"></div>
                <div className="company-hero-content">
                    <span className="company-hero-tag">SINCE 2025</span>
                    <h1>Our Story</h1>
                    <p>A legacy of precision, passion, and timeless craftsmanship</p>
                </div>
            </div>

            {/* Content */}
            <div className="company-content">
                {/* Origins */}
                <section className="company-section">
                    <div className="company-section-badge">THE BEGINNING</div>
                    <h2>Where It All Began</h2>
                    <div className="company-text-grid">
                        <div className="company-text-block">
                            <p>
                                CHRONOS was born in September 2025 in a small Indian workshop, where master
                                horologist Aditya crafted his first timepiece — a pocket watch
                                of extraordinary precision that won the Geneva Observatory Prize.
                            </p>
                            <p>
                                What began as one man's obsession with perfection evolved into a
                                dynasty of watchmaking excellence. Aditya's philosophy was simple yet
                                radical: every component, no matter how small, deserved the same
                                meticulous attention to detail. By late September two very ambitious and visionary friends
                                Devi and Digdarshan decided to join more company that would change the way people think about watches.
                            </p>
                        </div>
                        <div className="company-text-block">
                            <p>
                                By the late 2025, CHRONOS had established itself as one of
                                the premier watchmakers in Silicon University Sec-D. The brand's commitment to
                                hand-finished movements and innovative complications attracted
                                collectors and connoisseurs from around the world.
                            </p>
                            <p>
                                Each CHRONOS timepiece carries forward over 1450 hours of heritage,
                                blending time-honored techniques with cutting-edge innovation.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="company-section company-section-dark">
                    <div className="company-section-badge">MILESTONES</div>
                    <h2>A Journey Through Time</h2>
                    <div className="timeline">
                        <div className="timeline-item">
                            <div className="timeline-year">September 2025</div>
                            <div className="timeline-content">
                                <h3>The Foundation</h3>
                                <p>Aditya, Devi and Digdarshan establish CHRONOS in Patia, Bhubaneswar, with a vision to create the world's most precise timepieces.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">October 2025</div>
                            <div className="timeline-content">
                                <h3>College Partnership</h3>
                                <p>CHRONOS becomes the official timekeeper for local sporting events, showcasing unparalleled accuracy on the college stage.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">November 2025</div>
                            <div className="timeline-content">
                                <h3>The Explorer Revolution</h3>
                                <p>Launch of the Explorer Series — engineered to withstand the most extreme conditions on Earth, from ocean depths to mountain summits.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">December 2025</div>
                            <div className="timeline-content">
                                <h3>Signature Movement</h3>
                                <p>Development of the proprietary CHRONOS Calibre 3000, a self-winding movement with a 72-hour power reserve that redefined industry standards.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">January 2026</div>
                            <div className="timeline-content">
                                <h3>Heritage Reimagined</h3>
                                <p>Introduction of the Heritage Edition, paying homage to classic designs with modern engineering — bridging past and future.</p>
                            </div>
                        </div>
                        <div className="timeline-item">
                            <div className="timeline-year">February 2026</div>
                            <div className="timeline-content">
                                <h3>The Future of Time</h3>
                                <p>CHRONOS continues to push boundaries with sustainable materials, innovative complications, and a commitment to excellence that spans generations.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="company-section">
                    <div className="company-section-badge">OUR PHILOSOPHY</div>
                    <h2>What Drives Us</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">⚙️</div>
                            <h3>Precision</h3>
                            <p>Every CHRONOS movement is tested for 500 hours before leaving our atelier, ensuring accuracy to within ±2 seconds per day.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">✋</div>
                            <h3>Craftsmanship</h3>
                            <p>Our master watchmakers dedicate over 200 hours to each timepiece, hand-finishing every surface and assembling each component with care.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">💎</div>
                            <h3>Heritage</h3>
                            <p>We honor 130+ years of tradition while embracing innovation — every new collection carries the DNA of Henri Beaumont's original vision.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🌍</div>
                            <h3>Sustainability</h3>
                            <p>A timepiece built to last generations is inherently sustainable. We use responsibly sourced materials and carbon-neutral manufacturing.</p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="company-section company-section-cta">
                    <h2>Experience CHRONOS</h2>
                    <p>Discover the collection that continues a legacy of over a century of Swiss watchmaking excellence.</p>
                    <button className="company-cta-btn" onClick={() => navigate('/collections')}>
                        EXPLORE COLLECTIONS
                    </button>
                </section>
            </div>
        </div>
    );
}

export default OurStory;
