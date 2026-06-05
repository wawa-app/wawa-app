import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToken, getToken, deleteToken } from '../storage/tokenStorage';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on app launch
    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getToken();
                if (token) {
                    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // TODO: replace with /api/auth/me once endpoint is available
                    setUser({ token });
                }
            } catch (err) {
                console.error('[AuthContext] loadToken error:', err);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        await saveToken(token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
    };

    const signup = async (email, password) => {
        const response = await apiClient.post('/api/auth/signup', { email, password });
        const { token, user } = response.data;
        await saveToken(token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        await deleteToken();
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);