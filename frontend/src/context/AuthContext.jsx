import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    // This effect runs only ONCE when the app first loads.
    // It checks localStorage to immediately restore the session.
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const storedMember = localStorage.getItem('member');

            if (storedMember) {
                setMember(JSON.parse(storedMember));
            } else if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse auth data from localStorage", error);
            // Clear corrupted storage
            localStorage.removeItem('user');
            localStorage.removeItem('member');
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = async () => {
        try {
            const apiPath = user ? '/user/logout' : '/member/logout';
            await api.get(apiPath);
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        } finally {
            // Clear state and localStorage regardless of API call success
            setUser(null);
            setMember(null);
            localStorage.removeItem('user');
            localStorage.removeItem('member');
            localStorage.removeItem('token');
        }
    };

    // This function is now used by the login page.
    // It sets the state AND saves the data to localStorage.
    const loginUserContext = (userData) => {
        setUser(userData);
        setMember(null);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.removeItem('member'); // Ensure only one is ever stored
    };

    // This function is now used by the login page for members.
    const loginMemberContext = (memberData) => {
        setMember(memberData);
        setUser(null);
        localStorage.setItem('member', JSON.stringify(memberData));
        localStorage.removeItem('user'); // Ensure only one is ever stored
    };

    const value = useMemo(() => ({
        user,
        member,
        isAuthenticated: !!(user || member),
        loading,
        logout,
        loginUserContext,
        loginMemberContext,
    }), [user, member, loading]);

    return (
        <AuthContext.Provider value={value}>
            {/* The app will not render until the initial localStorage check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
