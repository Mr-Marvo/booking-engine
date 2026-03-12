import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export default function ViewBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user, token } = useAuth();

    useEffect(() => {
        if (user?._id) {
            fetchBookings();
        }
    }, [user, page]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            if (user.role !== 'vendor') {
                setLoading(false);
                return;
            }

            const res = await axios.get(`${API_BASE}/bookings/vendor?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(res.data.bookings);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Bookings Management</h1>
                    <p className="text-secondary mt-2 text-lg font-medium">View and manage all guest reservations.</p>
                </div>
            </header>

            <div className="card p-0! overflow-hidden shadow-xl border border-border">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 text-secondary">
                        <div className="text-5xl mb-4">📅</div>
                        <p className="text-lg font-medium">No bookings found yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="border-b-2 border-border text-left bg-slate-50 text-xs uppercase text-slate-500 font-black tracking-widest">
                                        <th className="p-5">Guest</th>
                                        <th className="p-5">Listing</th>
                                        <th className="p-5">Price</th>
                                        <th className="p-5">Status</th>
                                        <th className="p-5">Date Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(b => (
                                        <tr key={b._id} className="border-b border-border hover:bg-slate-50 transition-colors">
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900">{b.userId?.name || 'Guest User'}</div>
                                                <div className="text-xs text-secondary">{b.userId?.email || 'N/A'}</div>
                                            </td>
                                            <td className="p-5">
                                                <div className="font-bold text-blue-600">{b.listingId?.title || 'Unknown Listing'}</div>
                                                <div className="text-xs text-secondary capitalize">{b.listingId?.type}</div>
                                            </td>
                                            <td className="p-5 font-black text-slate-900">${b.totalPrice}</td>
                                            <td className="p-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-secondary font-medium">
                                                {new Date(b.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="p-5 flex items-center justify-between border-t border-border bg-slate-50/50">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-slate-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-all active:scale-95"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-slate-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
