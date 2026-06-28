import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveToken, getToken, deleteToken } from '../storage/tokenStorage';
import apiClient from '../api/client';

const AuthContext = createContext();
const USER_KEY = 'wawa_user';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFirstLogin, setIsFirstLogin] = useState(false);

    // Check for existing token on app launch
    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await getToken();
                if (!token) return;

                // 1. Restore session immediately from cache so the UI doesn't block
                const cachedUser = await AsyncStorage.getItem(USER_KEY);
                if (cachedUser) setUser(JSON.parse(cachedUser));

                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (err) {
                console.error('[AuthContext] loadToken error:', err);
            } finally {
                // Show the app immediately — don't wait for the network
                setLoading(false);
            }

            // 2. Fetch fresh user data in the background (non-blocking)
            try {
                const response = await apiClient.get('/api/auth/me');
                const freshUser = response.data.user;
                setUser(freshUser);
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            } catch (networkErr) {
                if (networkErr.response?.status === 401) {
                    // Token expired — force logout
                    await deleteToken();
                    await AsyncStorage.removeItem(USER_KEY);
                    delete apiClient.defaults.headers.common['Authorization'];
                    setUser(null);
                }
                // Network error — keep cached user so offline access still works
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/api/auth/login', { email, password });
        const { token, user } = response.data;
        await saveToken(token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setIsFirstLogin(user.isFirstLogin ?? false);
    };

    const signup = async (email, password) => {
        const response = await apiClient.post('/api/auth/signup', { email, password });
        const { token, user } = response.data;
        await saveToken(token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        setIsFirstLogin(true);
    };

    const logout = async () => {
        await apiClient.post('/api/auth/logout');
        await deleteToken();
        await AsyncStorage.removeItem(USER_KEY);
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
        setIsFirstLogin(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, isFirstLogin, setIsFirstLogin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);