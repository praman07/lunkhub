import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await getMe();
            if (data && data.user) {
                setUser(data.user);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async ({ identifier, password }) => {
        try {
            const data = await apiLogin({ identifier, password });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const register = async ({ username, email, password }) => {
        try {
            const data = await apiRegister({ username, email, password });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
