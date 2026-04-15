import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup,
} from 'react-simple-maps';
import Breadcrumb from '../components/Breadcrumb.jsx';
import '../styles/ServiceCenters.css';

// Using unpkg CDN for the Natural Earth TopoJSON world map
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const serviceCenters = [
    {
        id: 1,
        city: 'Tokyo',
        country: 'Japan',
        address: '2-4-1 Marunouchi, Chiyoda-ku, Tokyo 100-6319',
        phone: '+81 3-5220-7000',
        hours: 'Mon–Sat: 10:00 – 19:00',
        services: ['Full Overhaul', 'Bracelet Repair', 'Water-Resistance Test', 'Crystal Replacement'],
        coordinates: [139.6917, 35.6895],
    },
    {
        id: 2,
        city: 'New Delhi',
        country: 'India',
        address: 'Connaught Place, New Delhi 110001',
        phone: '+91 11-4600-1234',
        hours: 'Mon–Sat: 10:00 – 18:30',
        services: ['Movement Service', 'Strap Replacement', 'Polishing', 'Warranty Claims'],
        coordinates: [77.2090, 28.6139],
    },
    {
        id: 3,
        city: 'Bhubaneswar',
        country: 'India',
        address: 'Patia, Bhubaneswar, Odisha 751024',
        phone: '+91 674-234-5678',
        hours: 'Mon–Sat: 09:30 – 18:00',
        services: ['Basic Service', 'Strap & Clasp Repair', 'Battery Replacement', 'Engraving'],
        coordinates: [85.8245, 20.2961],
    },
    {
        id: 4,
        city: 'Geneva',
        country: 'Switzerland',
        address: 'Rue du Rhône 48, 1204 Genève',
        phone: '+41 22-317-8900',
        hours: 'Mon–Fri: 09:00 – 18:00',
        services: ['Master Watchmaker Service', 'Complications Repair', 'Vintage Restoration', 'Certification'],
        coordinates: [6.1432, 46.2044],
    },
    {
        id: 5,
        city: 'New York',
        country: 'USA',
        address: '650 Fifth Avenue, New York, NY 10019',
        phone: '+1 212-554-0400',
        hours: 'Mon–Sat: 10:00 – 18:00',
        services: ['Full Overhaul', 'Custom Engraving', 'Bracelet Sizing', 'Express Service'],
        coordinates: [-74.006, 40.7128],
    },
    {
        id: 6,
        city: 'Dubai',
        country: 'UAE',
        address: 'The Dubai Mall, Downtown Dubai',
        phone: '+971 4-330-8899',
        hours: 'Daily: 10:00 – 22:00',
        services: ['Full Service', 'Gold Polishing', 'Diamond Setting', 'Luxury Detailing'],
        coordinates: [55.2708, 25.2048],
    },
    {
        id: 7,
        city: 'Sydney',
        country: 'Australia',
        address: '45 Martin Place, Sydney NSW 2000',
        phone: '+61 2-9229-7777',
        hours: 'Mon–Fri: 09:00 – 17:30',
        services: ['Movement Service', 'Water-Resistance Test', 'Strap Replacement', 'Certification'],
        coordinates: [151.2093, -33.8688],
    },
];

function ServiceCenters() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const handleMarkerClick = (center) => {
        setSelected(center.id === selected?.id ? null : center);
    };

    return (
        <div className="sc-page">
            <Breadcrumb />
            <div className="sc-hero">
                <h1 className="sc-hero-title">Global Service Centers</h1>
                <p className="sc-hero-sub">
                    CHRONOS certified technicians are ready to serve you across the globe.
                    Click a pin on the map or a card below to learn more.
                </p>
            </div>

            <div className="sc-content">
                {/* Map */}
                <div className="sc-map-wrapper">
                    <ComposableMap
                        projection="geoMercator"
                        projectionConfig={{ scale: 130, center: [20, 10] }}
                        style={{ width: '100%', height: 'auto', background: '#0a0f1e', borderRadius: '16px' }}
                    >
                        <ZoomableGroup>
                            <Geographies geography={GEO_URL}>
                                {({ geographies }) =>
                                    geographies.map((geo) => (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill="#1e2d4e"
                                            stroke="#2d4a7a"
                                            strokeWidth={0.5}
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { fill: '#253d6a', outline: 'none' },
                                                pressed: { fill: '#253d6a', outline: 'none' },
                                            }}
                                        />
                                    ))
                                }
                            </Geographies>

                            {serviceCenters.map((center) => {
                                const isActive = selected?.id === center.id;
                                return (
                                    <Marker
                                        key={center.id}
                                        coordinates={center.coordinates}
                                        onClick={() => handleMarkerClick(center)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/* Outer glow */}
                                        <circle
                                            r={isActive ? 10 : 7}
                                            fill={isActive ? '#e45000' : '#c93c00'}
                                            opacity={0.25}
                                            className={isActive ? 'sc-pulse-outer' : ''}
                                        />
                                        {/* Main dot */}
                                        <circle
                                            r={isActive ? 5 : 4}
                                            fill={isActive ? '#e45000' : '#c93c00'}
                                            stroke="#fff"
                                            strokeWidth={1}
                                        />
                                        {/* City label */}
                                        <text
                                            y={-9}
                                            textAnchor="middle"
                                            fontSize={isActive ? 7 : 6}
                                            fill={isActive ? '#e45000' : '#aab8d0'}
                                            fontFamily="'Outfit', sans-serif"
                                            fontWeight={isActive ? '700' : '400'}
                                            style={{ pointerEvents: 'none', userSelect: 'none' }}
                                        >
                                            {center.city}
                                        </text>
                                    </Marker>
                                );
                            })}
                        </ZoomableGroup>
                    </ComposableMap>

                    {/* Detail card overlay */}
                    {selected && (
                        <div className="sc-tooltip">
                            <button className="sc-tooltip-close" onClick={() => setSelected(null)}>×</button>
                            <div className="sc-tooltip-header">
                                <span className="sc-tooltip-flag">📍</span>
                                <div>
                                    <h3 className="sc-tooltip-city">{selected.city}</h3>
                                    <span className="sc-tooltip-country">{selected.country}</span>
                                </div>
                            </div>
                            <div className="sc-tooltip-divider" />
                            <div className="sc-tooltip-info">
                                <p><span className="sc-label">Address</span>{selected.address}</p>
                                <p><span className="sc-label">Phone</span>{selected.phone}</p>
                                <p><span className="sc-label">Hours</span>{selected.hours}</p>
                            </div>
                            <div className="sc-tooltip-services">
                                <span className="sc-label">Services</span>
                                <div className="sc-services-grid">
                                    {selected.services.map((s, i) => (
                                        <span key={i} className="sc-service-tag">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Cards grid */}
                <div className="sc-grid">
                    {serviceCenters.map((center) => (
                        <div
                            key={center.id}
                            className={`sc-card ${selected?.id === center.id ? 'sc-card--active' : ''}`}
                            onClick={() => handleMarkerClick(center)}
                        >
                            <div className="sc-card-top">
                                <div>
                                    <h3 className="sc-card-city">{center.city}</h3>
                                    <span className="sc-card-country">{center.country}</span>
                                </div>
                                <span className="sc-card-icon">⌚</span>
                            </div>
                            <p className="sc-card-address">{center.address}</p>
                            <p className="sc-card-phone">{center.phone}</p>
                            <p className="sc-card-hours">{center.hours}</p>
                            <div className="sc-card-tags">
                                {center.services.slice(0, 2).map((s, i) => (
                                    <span key={i} className="sc-card-tag">{s}</span>
                                ))}
                                {center.services.length > 2 && (
                                    <span className="sc-card-tag sc-card-tag--more">+{center.services.length - 2} more</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ServiceCenters;
