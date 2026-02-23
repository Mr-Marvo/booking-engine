import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function CreateListing() {
    const router = useRouter();
    const { user, token } = useAuth();

    // Default state for form data
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'hotel',
        price: '',
        location: '',
        vendorId: '',
        roomType: 'single',
        movieTitle: '',
        showTime: '',
        area: '',
        usageType: 'event',
        vehicleType: 'car',
        capacity: '',
        amenities: '',
        features: ''
    });

    const [vendors, setVendors] = useState([]);

    // Fetch vendors if user is admin
    useEffect(() => {
        if (user?.role === 'admin') {
            fetchVendors();
        }
    }, [user]);

    const fetchVendors = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/vendors`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter for approved vendors only
            const approvedVendors = res.data.filter(v => v.role === 'vendor');
            setVendors(approvedVendors);
        } catch (err) {
            console.error('Error fetching vendors:', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUserId = user?._id || user?.id;

        if (!currentUserId) {
            toast.error('Your session has expired. Please log in again.');
            return;
        }

        // Determine vendorId: admin selects from dropdown, vendor uses their own ID
        let selectedVendorId;
        if (user.role === 'admin') {
            selectedVendorId = formData.vendorId;
            if (!selectedVendorId) {
                toast.error('Please select a vendor for this listing');
                return;
            }
        } else {
            selectedVendorId = currentUserId;
        }

        const payload = {
            ...formData,
            vendorId: selectedVendorId,
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
            toast.success('Listing published successfully!');
            router.push('/listings');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Error creating listing');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Create New Listing</h1>
                    <p className="text-secondary mt-2 text-lg font-medium">Add a new service to the booking engine platform.</p>
                </header>

                <div className="card p-8 shadow-xl border border-border">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Vendor Selection - Only for Admin */}
                        {user?.role === 'admin' && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-6 rounded-2xl">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Assign to Vendor *</label>
                                    <select
                                        name="vendorId"
                                        className="w-full p-4 rounded-xl border-2 border-blue-300 dark:border-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-bold bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all cursor-pointer"
                                        onChange={handleChange}
                                        value={formData.vendorId}
                                        required
                                    >
                                        <option value="">Select a vendor...</option>
                                        {vendors.map(vendor => (
                                            <option key={vendor._id} value={vendor._id}>
                                                {vendor.name} ({vendor.email})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">This listing will belong to the selected vendor</p>
                                </div>
                            </div>
                        )}

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
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6 underline underline-offset-8">Category Specific Details</h3>

                            {formData.type === 'hotel' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Room Type</label>
                                        <select name="roomType" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold">
                                            <option value="single">Single Room</option>
                                            <option value="double">Double Room</option>
                                            <option value="king">King Suite</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Amenities (comma separated)</label>
                                        <input type="text" name="amenities" onChange={handleChange} placeholder="WiFi, Pool, Spa" className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'cinema' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Movie Title</label>
                                        <input type="text" name="movieTitle" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Show Time</label>
                                        <input type="datetime-local" name="showTime" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
                                    </div>
                                </div>
                            )}

                            {formData.type === 'space' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Area (sq ft)</label>
                                        <input type="number" name="area" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Usage Type</label>
                                        <select name="usageType" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold">
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
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Vehicle Type</label>
                                        <select name="vehicleType" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold">
                                            <option value="car">Car</option>
                                            <option value="van">Van</option>
                                            <option value="bus">Bus</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Capacity</label>
                                        <input type="number" name="capacity" onChange={handleChange} className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase">Features</label>
                                        <input type="text" name="features" onChange={handleChange} placeholder="AC, GPS, Auto" className="p-3 rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold" />
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
                    border-radius: 2rem;
                }
                .text-secondary {
                    color: #64748b;
                }
                :global(.dark) .text-secondary {
                    color: #94a3b8;
                }
            `}</style>
        </AdminLayout>
    );
}
