import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function StepListingSelection({ formData, updateFormData }) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchListings();
    }, [formData.businessType]);

    const fetchListings = async () => {
        try {
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

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-2xl font-black text-slate-800 animate-pulse uppercase tracking-widest">Finding available {formData.businessType}s...</p>
        </div>
    );

    return (
        <div className="booking-step-content">
            <div className="text-center lg:text-left py-4 lg:py-0 self-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 lg:mb-6 flex flex-col lg:flex-row items-center gap-3 lg:gap-6 text-slate-900 tracking-tight leading-tight">
                    Select <span className="text-blue-500 uppercase">{formData.businessType}</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-500 font-semibold leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Choose one of our premium options to experience top-tier service.
                </p>
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
                                className={`booking-option-card transform transition-all duration-300 p-5 md:p-6 ${isSelected ? 'selected scale-[1.02] bg-blue-50/50' : 'hover:scale-[1.01] hover:bg-slate-50'}`}
                            >
                                <div className="flex flex-col gap-1 md:gap-2">
                                    <span className={`text-xl md:text-2xl font-black ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>{l.title}</span>
                                    <span className="text-sm md:text-base text-slate-500 flex items-center gap-1 font-semibold">📍 {l.location}</span>
                                </div>


                                <div className="text-right">
                                    <span className="block font-black text-2xl md:text-3xl text-blue-600">${l.price}</span>
                                    <span className="text-[10px] md:text-sm text-slate-400 uppercase font-black tracking-tighter">Per {formData.businessType === 'hotel' || formData.businessType === 'hostel' ? 'Night' : 'Session'}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
