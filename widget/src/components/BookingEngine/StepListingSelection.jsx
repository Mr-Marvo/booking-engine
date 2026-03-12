import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from './ThemeContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const TYPE_CONFIG = {
    hotel: { icon: '🏨', unit: 'Night' },
    hostel: { icon: '🏠', unit: 'Night' },
    cinema: { icon: '🎬', unit: 'Ticket' },
    vehicle: { icon: '🚗', unit: 'Day' },
    space: { icon: '🏢', unit: 'Hour' },
};

export default function StepListingSelection({ formData, updateFormData }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isDark } = useTheme();

    const config = TYPE_CONFIG[formData.businessType] || { icon: '📋', unit: 'Session' };

    useEffect(() => {
        fetchListings();
    }, [formData.businessType]);

    const fetchListings = async () => {
        setLoading(true);
        try {
            // const res = await axios.get(`${API_BASE}/listings`);
            // // Filter by selected business type
            // const filtered = res.data.filter(l => l.type === formData.businessType);
            // setListings(filtered);

            // Fetch with backend filtering by type and a high limit to ensure all listings are returned
            const res = await axios.get(`${API_BASE}/listings?type=${formData.businessType}&limit=100`);
            const allListings = res.data.listings || [];
            setListings(allListings);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = listings.filter(l =>
        l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.location?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32,
            alignItems: 'start',
            width: '100%',
        }}>
            {/* Left */}
            <div>
                <div className="w-badge" style={{ marginBottom: 20 }}>Step 3 of 5</div>
                <h1 style={{
                    fontSize: 'clamp(32px, 4.5vw, 60px)',
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.05,
                    color: 'var(--w-text)',
                    marginBottom: 16,
                }}>
                    Choose your<br />
                    <span style={{ color: 'var(--w-accent)' }}>
                        {config.icon} {formData.businessType}
                    </span>
                </h1>
                <p style={{
                    fontSize: 'clamp(14px, 1.5vw, 18px)',
                    color: 'var(--w-text-muted)',
                    fontWeight: 500,
                    lineHeight: 1.7,
                }}>
                    Browse our premium selection and pick the perfect option for your stay.
                </p>

                {/* Stats bar */}
                {!loading && (
                    <div className="w-glass-card" style={{ padding: '16px 20px', marginTop: 32, display: 'flex', gap: 24 }}>
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--w-accent)' }}>{listings.length}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--w-text-muted)' }}>Available</div>
                        </div>
                        <div style={{ width: 1, background: 'var(--w-border)' }} />
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--w-text)' }}>
                                {listings.length > 0
                                    ? `$${Math.min(...listings.map(l => l.price || 0))}`
                                    : '—'}
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--w-text-muted)' }}>From</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-2 md:pr-4 custom-scrollbar w-full max-w-lg mx-auto lg:ml-auto">
                {listings.length === 0 ? (
                    <div className="p-10 md:p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-4xl md:text-5xl mb-4 text-slate-300">🔍</div>
                        <p className="text-lg md:text-xl font-bold text-slate-400">No {formData.businessType}s found matching your criteria.</p>
                    </div>
                ) : (
                    listings.map(l => {
                        const listingId = l._id || l.id;
                        const selectedId = formData.selectedListing?._id || formData.selectedListing?.id;
                        const isSelected = selectedId && listingId && selectedId === listingId;

                        return (
                            <div
                                key={listingId}
                                onClick={() => updateFormData({ selectedListing: l })}
                                className={`w-option-card ${isSelected ? 'selected' : ''}`}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <span style={{ fontSize: 20, fontWeight: 900, color: isSelected ? 'var(--w-accent)' : 'var(--w-text)' }}>{l.title}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--w-text-muted)' }}>📍 {l.location}</span>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: 24, fontWeight: 900, color: 'var(--w-accent)' }}>${l.price}</span>
                                    <span style={{ display: 'block', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--w-text-muted)', marginTop: 2 }}>Per {config.unit}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
