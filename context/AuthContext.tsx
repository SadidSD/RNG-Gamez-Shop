'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface User {
    id: string;
    email: string;
    role: string;
    storeId: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from cookie/localStorage if needed
        // For simplicity, we just check if token exists, and if so, decode or fetch profile.
        // Ideally we fetch /auth/profile
        const token = Cookies.get('tcg-shop-token');
        if (token) {
            // For now, we trust the cookie existance for basic state, 
            // but a real app should verify.
            // We can decode JWT or just wait for explicit login action for now.
            // OR: Fetch profile
            fetchProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            Cookies.remove('tcg-shop-token');
        } finally {
            setLoading(false);
        }
    };

    const login = (token: string, userData: any) => {
        Cookies.set('tcg-shop-token', token, { expires: 7 }); // 7 days
        setUser(userData); // Usually payload from login response
        // Verify with full profile fetch if userData is partial
        if (!userData.email) fetchProfile(token);
    };

    const logout = () => {
        Cookies.remove('tcg-shop-token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
