import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000/api';

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth(); // Assuming 'token' is available in useAuth
    const [notifications, setNotifications] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${API_BASE}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [user, token]);

    // Calculate unread count whenever notifications change
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    useEffect(() => {
        if (!user) return;

        console.log('[Socket] User object:', user);
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            if (user.role === 'admin') {
                console.log('[Socket] Admin joining room: admin');
                socket.emit('join_room', 'admin');
            } else if (user.role === 'vendor') {
                const vendorRoom = `vendor_${user._id}`;
                console.log('[Socket] Vendor joining room:', vendorRoom, 'User ID:', user._id);
                socket.emit('join_room', vendorRoom);
            }
        });

        socket.on('notification', (data) => {
            console.log('[Socket] Received notification:', data);
            // Add new notification to state directly (it's already in DB)
            setNotifications(prev => [data, ...prev]);

            toast(data.message, {
                duration: 5000,
                position: 'top-right',
                icon: '🔔',
                style: {
                    background: '#333',
                    color: '#fff',
                },
            });

            try {
                // Simple beep sound
                const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//oeZhAAAAABJAAAAAAAAAAEBCAgIAAAASgAAAAE2AAAAJF//oeZhsAAAAASQAAAAAAAAABIQgICAAAQEoAAAABNgAAACRf/6HmYwAAAAAEkAAAAAAAAAASEICAgAABBKAAAAATYAAAAkX/+h5mOAAAAABJAAAAAAAAAAEhCAgIAAAQSP////7AAAACRgAAAA//oeZkAAAAAASQAAAAAAAAABIQgICAAAEEn/////sAAAAJGAAAAD/+h5mSAAAAAAEkAAAAAAAAAASEICAgAABBJ/////7AAAACRgAAAA//oeZkwAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZUAAAAAASQAAAAAAAAABIQgICAAAEEn/////sAAAAJGAAAAD/+h5mWAAAAAAEkAAAAAAAAAASEICAgAABBJ/////7AAAACRgAAAA//oeZlwAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZgAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZoAAAAAASQAAAAAAAAABIQgICAAAEEn/////sAAAAJGAAAAD/+h5maAAAAAAEkAAAAAAAAAASEICAgAABBJ/////7AAAACRgAAAA//oeZmwAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZwAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZ0AAAAAASQAAAAAAAAABIQgICAAAEEn/////sAAAAJGAAAAD/+h5meAAAAAAEkAAAAAAAAAASEICAgAABBJ/////7AAAACRgAAAA//oeZnAAAAAABJAAAAAAAAAAEhCAgIAAAQSf////+wAAAAkYAAAAP/6HmZ4AAAAAASQAAAAAAAAABIQgICAAAEEn/////sAAAAJGAAAAD');
                audio.play().catch(e => console.log('Audio play failed (user interaction maybe required)', e));
            } catch (e) { }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    const markAsRead = async (id) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));

            await fetch(`${API_BASE}/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error marking as read', error);
            fetchNotifications(); // Revert on error
        }
    };

    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));

            await fetch(`${API_BASE}/notifications/read-all`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error marking all as read', error);
            fetchNotifications();
        }
    };

    const clearNotifications = async () => {
        try {
            setNotifications([]);

            await fetch(`${API_BASE}/notifications`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error clearing notifications', error);
            fetchNotifications();
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isDrawerOpen,
            openDrawer,
            closeDrawer,
            markAsRead,
            markAllAsRead,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
