import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import GrowthChart from '../components/GrowthChart';

const API_BASE = 'http://localhost:5000/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/reports`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full sm:w-auto">
          <button className="btn bg-white dark:bg-slate-800 border border-border dark:border-slate-700 text-slate-900 dark:text-white text-sm px-3 py-2 flex-1 sm:flex-none">Last 7 Days</button>
          <button className="btn btn-accent text-sm px-3 py-2 flex-1 sm:flex-none">Download Report</button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: stats?.totalRevenue || 0, change: '↑ 14%', color: 'text-accent', icon: '💰', prefix: '$' },
          { label: 'Bookings', value: stats?.totalBookings || 0, change: '↑ 8%', color: 'text-text', icon: '📅' },
          { label: 'Active Listings', value: stats?.totalListings || 0, change: '↓ 2%', color: 'text-text', icon: '📑', neg: true },
          { label: 'Vendors', value: stats?.totalVendors || 12, change: '↑ 3 new', color: 'text-text', icon: '👥' },
        ].map((item, i) => (
          <div key={i} className="card relative overflow-hidden p-5 bg-white dark:bg-slate-800">
            <h3 className="text-secondary dark:text-gray-400 text-[10px] md:text-xs font-semibold uppercase mb-2 tracking-wider">{item.label}</h3>
            <p className={`text-2xl md:text-3xl font-bold ${item.color} dark:text-white`}>
              {item.prefix}{item.value}
            </p>
            <p className={`text-[10px] md:text-xs mt-2 font-medium ${item.neg ? 'text-red-500' : 'text-green-500'}`}>
              {item.change} vs last week
            </p>
            <div className="absolute -right-2 -bottom-2 opacity-10 text-6xl md:text-8xl select-none">{item.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Section */}
        <div className="card lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white">Platform Growth</h2>
            <Link href="/reports" className="text-xs md:text-sm text-accent hover:underline">View Detailed Reports →</Link>
          </div>
          <div className="w-full h-[300px]">
            <GrowthChart data={stats?.monthlyRevenue} />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="card p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-6 text-slate-900 dark:text-white">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {[
              { text: 'New vendor "Oceanic Stays" registered', time: '10 mins ago', icon: '👤' },
              { text: 'Booking #842 completed by User42', time: '2 hours ago', icon: '✅' },
              { text: 'New listing "Mountain Cabin" pending approval', time: '5 hours ago', icon: '🔔' },
              { text: 'Payout of $4,200 processed to VendorX', time: '1 day ago', icon: '💸' },
              {/* ... */ }
            ].map((activity, i) => (
              <div key={i} className={`flex gap-4 pb-4 ${i < 3 ? 'border-b border-border dark:border-slate-700' : ''}`}>
                <div className="text-xl shrink-0">{activity.icon}</div>
                <div className="min-w-0">
                  <p className="m-0 text-xs md:text-sm font-medium truncate">{activity.text}</p>
                  <p className="m-0 text-[10px] md:text-xs text-secondary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Link({ href, children, className }) {
  return <a href={href} className={className}>{children}</a>;
}

