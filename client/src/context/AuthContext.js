import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getApiUrl = () => {
    return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserFromStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error("Could not load user from storage", error);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        loadUserFromStorage();
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await axios.post(`${getApiUrl()}/auth/login`, { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
    }, []);

    const signup = useCallback(async (username, email, password) => {
        await axios.post(`${getApiUrl()}/auth/register`, { username, email, password });
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    }, []);

    // Memoize the context value to prevent unnecessary re-renders of consuming components
    const value = useMemo(() => ({
        user,
        loading,
        login,
        signup,
        logout
    }), [user, loading, login, signup, logout]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);