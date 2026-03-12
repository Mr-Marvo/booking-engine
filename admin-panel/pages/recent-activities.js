import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
}

export default function RecentActivities() {
    const [activities, setActivities] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchActivities();
    }, [page]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_BASE}/admin/recent-activities?page=${page}&limit=5`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActivities(res.data.activities);
            setPagination(res.data.pagination);
        } catch (err) {
            console.error('Failed to fetch activities:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Recent Activity</h1>
                    <p className="text-secondary dark:text-gray-400 text-sm mt-1">Detailed history of platform events</p>
                </div>
                <Link href="/" className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 text-slate-900 dark:text-white text-sm px-4 py-2">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="card p-0 overflow-hidden bg-white dark:bg-slate-800 mb-6">
                <div className="divide-y divide-border dark:divide-slate-700">
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-4 p-5 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))
                    ) : activities.length === 0 ? (
                        <div className="p-10 text-center">
                            <p className="text-secondary dark:text-gray-400">No activity recorded yet.</p>
                        </div>
                    ) : (
                        activities.map((activity, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="text-2xl bg-slate-100 dark:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                    {activity.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-slate-900 dark:text-white font-medium mb-1">{activity.text}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-secondary dark:text-gray-400">{timeAgo(activity.time)}</span>
                                        <span className="w-1 h-1 rounded-full bg-border dark:bg-slate-600"></span>
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-accent opacity-80">{activity.type?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mb-8">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${page === i + 1
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
                        className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 px-4 py-2 text-sm disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}
