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
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                if (payload.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else {
                    setToken(storedToken);
                    const parsedUser = JSON.parse(storedUser);
                    // Ensure _id exists for consistency
                    if (parsedUser && parsedUser.id && !parsedUser._id) {
                        parsedUser._id = parsedUser.id;
                    }
                    setUser(parsedUser);
                }
            } catch (e) {
                console.error("Error parsing stored user or token:", e);
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

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const timeRemaining = payload.exp * 1000 - Date.now();
                // Check if timeRemaining is within max 32-bit int bounds for setTimeout
                if (timeRemaining > 0 && timeRemaining <= 2147483647) {
                    const timer = setTimeout(() => {
                        logout();
                    }, timeRemaining);
                    return () => clearTimeout(timer);
                } else if (timeRemaining <= 0) {
                    logout();
                }
            } catch (e) {
                console.error("Error setting auto-logout timer:", e);
            }
        }
    }, [token]);

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
