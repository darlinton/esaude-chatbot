import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const profile = localStorage.getItem('profile');
        if (profile) {
            setUser(JSON.parse(profile));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.debug('Try Login: ', email);
            const { data } = await API.post('/auth/login', { email, password });
            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (displayName, email, password) => {
        try {
            console.debug('Try Signup :', displayName, email);
            const { data } = await API.post('/auth/signup', { displayName, email, password });
            localStorage.setItem('profile', JSON.stringify(data));
            setUser(data);
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('profile');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
