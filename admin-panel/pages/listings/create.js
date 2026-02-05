import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function CreateListing() {
    const router = useRouter();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'hotel',
        price: '',
        location: '',
        // Dynamic fields
        roomType: 'single',
        movieTitle: '',
        showTime: '',
        area: '',
        usageType: 'event',
        vehicleType: 'car',
        capacity: '',
        amenities: '', // Will split by comma
        features: '' // Will split by comma
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUserId = user?._id || user?.id;

        if (!currentUserId) {
            alert('Your session has expired. Please log in again.');
            return;
        }

        const payload = {
            ...formData,
            vendorId: currentUserId,
            price: Number(formData.price),
            amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()) : [],
            features: formData.features ? formData.features.split(',').map(s => s.trim()) : [],
            capacity: Number(formData.capacity),
            area: Number(formData.area),
            seatLayout: { rows: 10, cols: 10, aisles: [] } // Default for cinema
        };

        try {
            await axios.post(`${API_BASE}/listings`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Listing published successfully!');
            router.push('/listings');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error creating listing');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Create New Listing</h1>
                    <p className="text-secondary mt-2 text-lg font-medium">Add a new service to the booking engine platform.</p>
                </header>

                <div className="card p-8 shadow-xl border border-border">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Service Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold transition-all"
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Royal Suite"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Service Category</label>
                                <select
                                    name="type"
                                    className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold bg-white transition-all cursor-pointer"
                                    onChange={handleChange}
                                    value={formData.type}
                                >
                                    <option value="hotel">🏨 Hotel/Stay</option>
                                    <option value="cinema">🎬 Cinema/Movie</option>
                                    <option value="space">🏢 Event Space</option>
                                    <option value="vehicle">🚗 Vehicle Rental</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                            <textarea
                                name="description"
                                rows="4"
                                className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-medium transition-all"
                                onChange={handleChange}
                                required
                                placeholder="Describe your service in detail..."
                            ></textarea>
                        </div>

                        {/* Category Specific Fields */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-6 underline underline-offset-8">Category Specific Details</h3>

                            {formData.type === 'hotel' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Room Type</label>
                                        <select name="roomType" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold">
                                            <option value="single">Single Room</option>
                                            <option value="double">Double Room</option>
                                            <option value="king">King Suite</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Amenities (comma separated)</label>
                                        <input type="text" name="amenities" onChange={handleChange} placeholder="WiFi, Pool, Spa" className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'cinema' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Movie Title</label>
                                        <input type="text" name="movieTitle" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Show Time</label>
                                        <input type="datetime-local" name="showTime" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'space' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Area (sq ft)</label>
                                        <input type="number" name="area" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Usage Type</label>
                                        <select name="usageType" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold">
                                            <option value="event">Event</option>
                                            <option value="storage">Storage</option>
                                            <option value="office">Office</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {formData.type === 'vehicle' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Vehicle Type</label>
                                        <select name="vehicleType" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold">
                                            <option value="car">Car</option>
                                            <option value="van">Van</option>
                                            <option value="bus">Bus</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Capacity</label>
                                        <input type="number" name="capacity" onChange={handleChange} className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 uppercase">Features</label>
                                        <input type="text" name="features" onChange={handleChange} placeholder="AC, GPS, Auto" className="p-3 rounded-lg border border-border font-bold" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price per Unit ($)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold"
                                    onChange={handleChange}
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    className="w-full p-4 rounded-xl border border-border focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold"
                                    onChange={handleChange}
                                    required
                                    placeholder="City, Province, Country"
                                />
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-6">
                            <button type="submit" className="btn-primary bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex-1 sm:flex-none">
                                🚀 Publish Listing
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="bg-slate-100 text-slate-700 px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all flex-1 sm:flex-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .card {
                    background: white;
                    border-radius: 2rem;
                }
                .text-secondary {
                    color: #64748b;
                }
            `}</style>
        </AdminLayout>
    );
}
