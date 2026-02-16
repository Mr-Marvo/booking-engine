import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Store, List, BarChart, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, closeSidebar }) {
    const router = useRouter();
    const { user } = useAuth();


    const allNavItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'vendor'] },
        { name: 'Vendors (Admin)', href: '/vendors', icon: Store, roles: ['admin'] },
        { name: 'My Listings', href: '/listings', icon: List, roles: ['vendor'] },
        { name: 'All Listings', href: '/listings', icon: List, roles: ['admin'] },
        { name: 'Bookings', href: '/bookings', icon: List, roles: ['vendor'] },
        { name: 'Reports', href: '/reports', icon: BarChart, roles: ['admin', 'vendor'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'vendor'] },
    ];

    const userRole = user?.role || 'user';
    const navItems = allNavItems.filter(item => item.roles.includes(userRole));


    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:block
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Mobile User Profile Section */}
                <div className="lg:hidden p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-500 dark:text-gray-300">
                            <User className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Kasuni Sarangi'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Admin'}</p>
                        </div>
                    </div>
                </div>


                <div className="p-4 space-y-2 mt-4 lg:mt-20">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = router.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </aside>
        </>
    );
}
