import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://localhost:5000/api';

export default function ManageListings() {
    const [listings, setListings] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        fetchListings();
    }, [user, page]);


    const fetchListings = async () => {
        setLoading(true);
        try {
            let endpoint = `${API_BASE}/listings`;
            if (user?.role === 'vendor') {
                endpoint = `${API_BASE}/listings/my`;
            }

            const res = await axios.get(`${endpoint}?page=${page}&limit=8`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setListings(res.data.listings);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">{user?.role === 'vendor' ? 'My Listings' : 'All Listings'}</h1>
                <Link href="/listings/create" className="btn btn-accent no-underline w-full sm:w-auto text-center px-6 py-2 rounded-lg font-bold">
                    + Add New Listing
                </Link>
            </div>

            <div className="card p-0! overflow-hidden mt-8 shadow-md border border-border mb-6">
                {!loading && listings.length === 0 ? (
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
                                    {user?.role === 'admin' && <th className="p-4">Vendor</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(8)].map((_, i) => (
                                        <tr key={i} className="animate-pulse border-b border-border">
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                                            <td className="p-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                                            {user?.role === 'admin' && <td className="p-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>}
                                        </tr>
                                    ))
                                ) : listings.map(l => (
                                    <tr key={l._id} className="border-b border-border hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">{l.title}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-black uppercase bg-blue-50 text-blue-600">
                                                {l.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black text-blue-600">${l.price}</td>
                                        <td className="p-4 text-secondary font-medium">{l.location}</td>
                                        {user?.role === 'admin' && <td className="p-4 text-sm font-bold text-slate-600">{l.vendorId?.name || 'N/A'}</td>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="btn bg-white border border-border px-4 py-2 text-sm disabled:opacity-50 font-bold"
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
                                        : 'bg-white border border-border hover:bg-slate-50'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages || loading}
                        className="btn bg-white border border-border px-4 py-2 text-sm disabled:opacity-50 font-bold"
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
