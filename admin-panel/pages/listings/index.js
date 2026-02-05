import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function ManageListings() {
    const [listings, setListings] = useState([]);
    const { user, token } = useAuth();

    useEffect(() => {
        const vendorId = user?._id || user?.id;
        if (vendorId) {
            fetchListings(vendorId);
        }
    }, [user]);


    const fetchListings = async (vendorId) => {
        try {
            const res = await axios.get(`${API_BASE}/listings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter for this vendor (in a real app, backend might handle this)
            setListings(res.data.filter(l => l.vendorId?._id === vendorId || l.vendorId === vendorId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">My Listings</h1>
                <Link href="/listings/create" className="btn btn-accent no-underline w-full sm:w-auto text-center px-6 py-2 rounded-lg font-bold">
                    + Add New Listing
                </Link>
            </div>

            <div className="card p-0! overflow-hidden mt-8 shadow-md border border-border">
                {listings.length === 0 ? (
                    <div className="text-center py-20 text-secondary">
                        <div className="text-5xl mb-4">📑</div>
                        <p className="text-lg font-medium">No listings found. Create your first listing to get started!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-border text-left bg-slate-50 text-xs uppercase text-secondary font-black tracking-widest">
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Location</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listings.map(l => (
                                    <tr key={l._id} className="border-b border-border hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">{l.title}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-600">
                                                {l.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black text-blue-600">${l.price}</td>
                                        <td className="p-4 text-secondary font-medium">{l.location}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
