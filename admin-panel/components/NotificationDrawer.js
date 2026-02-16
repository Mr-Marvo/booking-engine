import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Check, Trash2, Bell, Calendar, User, Store, FileText } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationDrawer() {
    const {
        isDrawerOpen,
        closeDrawer,
        notifications,
        markAsRead,
        markAllAsRead,
        clearNotifications
    } = useNotification();

    const getIcon = (type) => {
        switch (type) {
            case 'new_booking': return <Calendar className="h-5 w-5 text-blue-500" />;
            case 'new_vendor': return <Store className="h-5 w-5 text-purple-500" />;
            case 'new_listing': return <FileText className="h-5 w-5 text-green-500" />;
            default: return <Bell className="h-5 w-5 text-gray-500" />;
        }
    };

    const formatTime = (isoString) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleString();
        } catch (e) {
            return '';
        }
    };

    return (
        <Transition.Root show={isDrawerOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeDrawer}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-30 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300 sm:duration-500"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-300 sm:duration-500"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-slate-800 shadow-xl">
                                        <div className="px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Notifications
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white dark:bg-slate-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                                                        onClick={closeDrawer}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <X className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-blue-600 hover:text-blue-500 font-medium flex items-center"
                                                >
                                                    <Check className="w-3 h-3 mr-1" /> Mark all read
                                                </button>
                                                <button
                                                    onClick={clearNotifications}
                                                    className="text-xs text-red-600 hover:text-red-500 font-medium flex items-center ml-4"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" /> Clear all
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            {notifications.length === 0 ? (
                                                <div className="text-center py-10">
                                                    <Bell className="mx-auto h-12 w-12 text-gray-300" />
                                                    <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
                                                </div>
                                            ) : (
                                                <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                                                    {notifications.map((notification) => (
                                                        <li
                                                            key={notification.id}
                                                            className={`py-4 px-2 rounded-lg cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 dark:bg-slate-700/50' : 'hover:bg-gray-50 dark:hover:bg-slate-700/30'
                                                                }`}
                                                            onClick={() => markAsRead(notification.id)}
                                                        >
                                                            <div className="flex space-x-3">
                                                                <div className="shrink-0 pt-1">
                                                                    {getIcon(notification.type)}
                                                                </div>
                                                                <div className="flex-1 space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                            {notification.type.replace('new_', 'New ').toUpperCase()}
                                                                        </h3>
                                                                        <p className="text-xs text-gray-400">
                                                                            {formatTime(notification.timestamp)}
                                                                        </p>
                                                                    </div>
                                                                    <p className={`text-sm ${!notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                                                                        {notification.message}
                                                                    </p>
                                                                </div>
                                                                {!notification.read && (
                                                                    <div className="shrink-0 self-center">
                                                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
