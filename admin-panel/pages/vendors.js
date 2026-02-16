import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';

const API_BASE = 'http://localhost:5000/api';

export default function Vendors() {
    const [vendors, setVendors] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendors();
    }, [page]);

    const fetchVendors = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/admin/vendors?page=${page}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVendors(res.data.vendors);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Error fetching vendors', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (action === 'approve') {
                await axios.post(`${API_BASE}/admin/vendors/approve`, { vendorId: id }, config);
                toast.success('Vendor approved');
            } else if (action === 'suspend') {
                await axios.post(`${API_BASE}/admin/vendors/suspend`, { vendorId: id }, config);
                toast.success('Vendor suspended');
            } else {
                toast.success(`Vendor ${action} action performed`);
            }
            fetchVendors();
        } catch (err) {
            toast.error('Action failed: ' + (err.response?.data?.message || err.message));
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

            <div className="card !p-0 overflow-hidden mb-6">
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
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse border-b border-border dark:border-slate-700">
                                        <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-1"></div><div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div></td>
                                        <td className="p-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                                        <td className="p-4"><div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16"></div></td>
                                        <td className="p-4"><div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredVendors.map(vendor => (
                                <tr key={vendor._id} className="border-b border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="p-4">
                                        <div className="font-semibold text-sm text-slate-900 dark:text-white">{vendor.name}</div>
                                        <div className="text-xs text-secondary dark:text-slate-400">{vendor.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{vendor.type || 'N/A'}</td>
                                    <td className="p-4 text-sm text-secondary dark:text-slate-400">{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${vendor.status === 'active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {vendor.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            {vendor.status === 'pending' && (
                                                <button onClick={() => handleAction(vendor._id, 'approve')} className="btn btn-accent px-3 py-1 text-xs font-bold">
                                                    Approve
                                                </button>
                                            )}
                                            <button onClick={() => handleAction(vendor._id, 'suspend')} className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-slate-700 font-bold">
                                                Suspend
                                            </button>
                                            <button onClick={() => handleAction(vendor._id, 'delete')} className="btn bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900 text-red-500 dark:text-red-400 px-3 py-1 text-xs hover:bg-red-50 dark:hover:bg-red-900/20 font-bold">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredVendors.length === 0 && (
                    <div className="text-center py-12 text-secondary">
                        No vendors found matching your search.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 px-4 py-2 text-sm disabled:opacity-50 font-bold"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-black transition-colors ${page === i + 1
                                        ? 'bg-accent text-white'
                                        : 'bg-white dark:bg-slate-800 border border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages || loading}
                        className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 px-4 py-2 text-sm disabled:opacity-50 font-bold"
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}

