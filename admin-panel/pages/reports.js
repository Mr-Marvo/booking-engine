import { useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export default function Reports() {
    const [reportType, setReportType] = useState('revenue');
    const [dateRange, setDateRange] = useState('last-30');

    // Mock data for the demonstration
    const mockReportData = [
        { id: 1, date: '2026-01-01', description: 'Booking - Grand Hotel', amount: 450, status: 'Completed' },
        { id: 2, date: '2026-01-03', description: 'Booking - Cinema City', amount: 25, status: 'Completed' },
        { id: 3, date: '2026-01-05', description: 'Booking - Event Space A', amount: 1200, status: 'Pending' },
        { id: 4, date: '2026-01-07', description: 'Booking - Luxury Car Rental', amount: 150, status: 'Completed' },
    ];

    const handleGenerate = () => {
        const downloadUrl = `${API_BASE}/admin/export-report?type=${reportType}&range=${dateRange}`;
        window.location.href = downloadUrl;
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h1>
                <button
                    onClick={handleGenerate}
                    className="btn btn-accent px-6 py-2 w-full sm:w-auto"
                >
                    Generate Report
                </button>
            </div>

            {/* Filters Section */}
            <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Report Type</label>
                    <select
                        className="w-full p-2.5 rounded-md border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="revenue">Revenue Report</option>
                        <option value="bookings">Bookings Summary</option>
                        <option value="vendors">Vendor Performance</option>
                        <option value="inventory">Inventory Analysis</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date Range</label>
                    <select
                        className="w-full p-2.5 rounded-md border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="today">Today</option>
                        <option value="last-7">Last 7 Days</option>
                        <option value="last-30">Last 30 Days</option>
                        <option value="custom">Custom Range</option>
                    </select>
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Export Format</label>
                    <select className="w-full p-2.5 rounded-md border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent">
                        <option value="pdf">PDF Document</option>
                        <option value="csv">CSV Spreadsheet</option>
                        <option value="excel">Excel Worksheet</option>
                    </select>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                    { label: 'Total Sales', value: '$12,450.00', change: '↑ 12%', color: 'border-accent', text: 'text-green-600 dark:text-green-400' },
                    { label: 'Active Bookings', value: '84', change: '↑ 5%', color: 'border-amber-500', text: 'text-green-600 dark:text-green-400' },
                    { label: 'Avg. Order Value', value: '$148.20', change: 'Steady', color: 'border-red-500', text: 'text-slate-500 dark:text-slate-400' },
                ].map((stat, i) => (
                    <div key={i} className={`card p-6 border-l-4 ${stat.color} bg-white dark:bg-slate-800`}>
                        <h3 className="text-secondary dark:text-slate-400 text-[10px] md:text-xs uppercase font-semibold mb-2">{stat.label}</h3>
                        <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        <p className={`${stat.text} text-[10px] md:text-xs mt-2 font-medium`}>{stat.change} growth</p>
                    </div>
                ))}
            </div>

            {/* Report Data Table */}
            <div className="card p-0! overflow-hidden">
                <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transaction Log</h2>
                    <span className="text-xs text-secondary dark:text-slate-400 font-medium">Showing {mockReportData.length} records</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead>
                            <tr className="border-b border-border dark:border-slate-700 text-left bg-slate-50 dark:bg-slate-900/50 text-[10px] md:text-xs uppercase text-secondary dark:text-slate-400">
                                <th className="p-4 font-bold">Date</th>
                                <th className="p-4 font-bold">Description</th>
                                <th className="p-4 font-bold">Amount</th>
                                <th className="p-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockReportData.map(item => (
                                <tr key={item.id} className="border-b border-border dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="p-4 text-xs md:text-sm text-slate-600 dark:text-slate-300">{item.date}</td>
                                    <td className="p-4 text-xs md:text-sm font-medium text-slate-900 dark:text-white">{item.description}</td>
                                    <td className="p-4 text-xs md:text-sm font-bold text-slate-900 dark:text-white">${item.amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
