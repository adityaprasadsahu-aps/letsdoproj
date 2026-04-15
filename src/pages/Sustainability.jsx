import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/CompanyPages.css';

function Sustainability() {
    const navigate = useNavigate();
    return (
        <div className="company-page">
            <Breadcrumb />
            {/* Hero Banner */}}
            <div className="company-hero" style={{ backgroundImage: 'linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 50%, #0a2e1a 100%)' }}>
                <div className="company-hero-overlay"></div>
                <div className="company-hero-content">
                    <span className="company-hero-tag">OUR COMMITMENT</span>
                    <h1>Sustainability</h1>
                    <p>Building timepieces that honor both tradition and our planet</p>
                </div>
            </div>

            {/* Content */}
            <div className="company-content">
                {/* Vision */}
                <section className="company-section">
                    <div className="company-section-badge">OUR VISION</div>
                    <h2>Time for Change</h2>
                    <div className="company-text-grid">
                        <div className="company-text-block">
                            <p>
                                At CHRONOS, we believe that luxury and responsibility are not
                                mutually exclusive. A timepiece designed to last generations is
                                inherently a sustainable product — and we take that philosophy
                                further at every step of our process.
                            </p>
                            <p>
                                From sourcing raw materials to the final polish, every decision
                                is guided by our commitment to minimize environmental impact while
                                maximizing the beauty and longevity of our creations.
                            </p>
                        </div>
                        <div className="company-text-block">
                            <p>
                                Our Geneva atelier has been carbon-neutral since 2020, powered
                                entirely by renewable energy. We've reduced our water usage by
                                60% through closed-loop recycling systems and eliminated single-use
                                plastics across our entire supply chain.
                            </p>
                            <p>
                                By 2030, we aim to achieve net-zero emissions across our entire
                                value chain, setting a new standard for the luxury watch industry.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="company-section company-section-dark">
                    <div className="company-section-badge">BY THE NUMBERS</div>
                    <h2>Our Impact</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Renewable Energy</div>
                            <p>Our manufacturing facilities run entirely on solar and wind power</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">60%</div>
                            <div className="stat-label">Water Reduction</div>
                            <p>Closed-loop systems dramatically cut our water consumption</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">Zero</div>
                            <div className="stat-label">Single-Use Plastic</div>
                            <p>Completely eliminated from manufacturing and packaging</p>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">95%</div>
                            <div className="stat-label">Recyclable Packaging</div>
                            <p>Our packaging uses FSC-certified, fully recyclable materials</p>
                        </div>
                    </div>
                </section>

                {/* Pillars */}
                <section className="company-section">
                    <div className="company-section-badge">THREE PILLARS</div>
                    <h2>Our Sustainability Framework</h2>
                    <div className="pillars-grid">
                        <div className="pillar-card">
                            <div className="pillar-number">01</div>
                            <h3>Responsible Sourcing</h3>
                            <p>
                                All precious metals are sourced from certified responsible mines.
                                Our diamonds and gemstones are conflict-free and traceable to their
                                origin. We partner with suppliers who share our commitment to ethical
                                labor practices and environmental stewardship.
                            </p>
                        </div>
                        <div className="pillar-card">
                            <div className="pillar-number">02</div>
                            <h3>Circular Design</h3>
                            <p>
                                CHRONOS watches are designed to be repaired, not replaced. Our
                                service centers extend the life of every timepiece through expert
                                restoration. We also offer a trade-in program where vintage CHRONOS
                                watches are restored and given new life.
                            </p>
                        </div>
                        <div className="pillar-card">
                            <div className="pillar-number">03</div>
                            <h3>Community Impact</h3>
                            <p>
                                Through the CHRONOS Foundation, we invest in horological education,
                                environmental conservation, and the communities where we operate.
                                Our apprenticeship programs have trained over 500 young watchmakers
                                in sustainable craftsmanship.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="company-section company-section-cta" style={{ background: 'linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 100%)' }}>
                    <h2>Learn More About Our Commitment</h2>
                    <p>Every CHRONOS watch represents our pledge to a more sustainable future.</p>
                    <button className="company-cta-btn" onClick={() => navigate('/collections')}>
                        EXPLORE COLLECTIONS
                    </button>
                </section>
            </div>
        </div>
    );
}

export default Sustainability;
