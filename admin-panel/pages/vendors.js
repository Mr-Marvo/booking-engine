import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const API_BASE = 'http://localhost:5000/api';

export default function Vendors() {
    const [vendors, setVendors] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/vendors`);
            // Add mock status and type for demonstration since it might not be in the real API yet
            const enrichedVendors = res.data.map(v => ({
                ...v,
                status: v.isApproved ? 'active' : 'pending',
                type: ['Hotel', 'Cinema', 'Rental'][Math.floor(Math.random() * 3)],
                joined: '2025-11-12'
            }));
            setVendors(enrichedVendors);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                await axios.post(`${API_BASE}/admin/vendors/approve`, { vendorId: id });
                alert('Vendor approved');
            } else {
                alert(`Vendor ${action} action performed (Mock)`);
            }
            fetchVendors();
        } catch (err) {
            alert('Action failed');
        }
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Vendor Management</h1>
                <div className="relative w-full sm:w-[300px]">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b-1 border-gray-500 dark:border-slate-700 text-left text-secondary dark:text-slate-400 text-xs uppercase">
                                <th className="p-4 font-semibold">Vendor Details</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Member Since</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredVendors.map(vendor => (
                                <tr key={vendor.id} className="border-b border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{vendor.name}</div>
                                        <div className="text-xs text-secondary dark:text-slate-400">{vendor.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{vendor.type}</td>
                                    <td className="p-4 text-sm text-secondary dark:text-slate-400">{vendor.joined}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${vendor.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {vendor.status === 'pending' && (
                                                <button onClick={() => handleAction(vendor.id, 'approve')} className="btn btn-accent px-3 py-1 text-xs">
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => handleAction(vendor.id, 'suspend')} className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-slate-700">
                                                Suspend
                                            </button>
                                            <button onClick={() => handleAction(vendor.id, 'delete')} className="btn bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900 text-red-500 dark:text-red-400 px-3 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredVendors.length === 0 && (
                    <div className="text-center py-12 text-secondary">
                        No vendors found matching your search.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

