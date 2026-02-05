import Link from 'next/link';
import { Fragment } from 'react';
import { Popover, Transition, Switch } from '@headlessui/react';
import { Bell, User, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';




export default function Header({ toggleSidebar }) {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();


    return (
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between px-4 fixed top-0 right-0 left-0 z-30 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg lg:hidden"
                >
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin<span className="text-orange-500">Panel</span></span>
            </div>

            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <span className="sr-only">View notifications</span>
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                        1
                    </span>
                </button>

                {/* Profile Dropdown */}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={`
                                    flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                    ${open ? '' : 'text-opacity-90'}
                                `}
                            >
                                <User className="w-6 h-6" />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-md bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-slate-700">
                                    <div className="px-4 py-4 border-b border-gray-200 dark:border-slate-700">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'Kasuni Sarangi'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'kasunisarangi259@gmail.com'}</p>
                                    </div>

                                    <div className="py-1">
                                        <Link href="/profile" className="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700">
                                            <User className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                            My Profile
                                        </Link>
                                    </div>

                                    <div className="py-1 px-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer" onClick={toggleTheme}>
                                        <div className="flex items-center">
                                            {theme === 'dark' ? (
                                                <Moon className="mr-3 h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Sun className="mr-3 h-5 w-5 text-gray-400" />
                                            )}
                                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                                            </span>
                                        </div>
                                        <Switch
                                            checked={theme === 'dark'}
                                            onChange={toggleTheme}
                                            className={`${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}
                                                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                        >
                                            <span className="sr-only">Use setting</span>
                                            <span
                                                aria-hidden="true"
                                                className={`${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
                                                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </Switch>
                                    </div>

                                    <div className="py-1 border-t border-gray-200 dark:border-slate-700">
                                        <button
                                            onClick={logout}
                                            className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                                            Log out
                                        </button>
                                    </div>

                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>
            </div>
        </header>
    );
}
