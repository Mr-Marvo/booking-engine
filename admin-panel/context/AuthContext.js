import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                const parsedUser = JSON.parse(storedUser);
                // Ensure _id exists for consistency
                if (parsedUser && parsedUser.id && !parsedUser._id) {
                    parsedUser._id = parsedUser.id;
                }
                setUser(parsedUser);
            } catch (e) {
                console.error("Error parsing stored user:", e);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
            const { token, user } = res.data;
            const normalizedUser = { ...user, _id: user._id || user.id };

            setToken(token);
            setUser(normalizedUser);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await axios.post(`${API_BASE}/auth/signup`, userData);
            const { token, user } = res.data;
            const normalizedUser = { ...user, _id: user._id || user.id };

            setToken(token);
            setUser(normalizedUser);

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(normalizedUser));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
