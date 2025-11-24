import { useState, useEffect } from 'react';
import AuthService, { LoginCredentials, RegisterCredentials } from '../services/AuthService';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const [user, setUser] = useState<{ username: string; role: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        const storedRole = localStorage.getItem('role');
        const storedUsername = localStorage.getItem('username');
        if (storedRole && storedUsername) {
            setUser({ username: storedUsername, role: storedRole });
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        setLoading(true);
        try {
            const result = await AuthService.login(credentials);
            if (result.success && result.username && result.role) {
                localStorage.setItem('role', result.role);
                localStorage.setItem('username', result.username);
                setUser({ username: result.username, role: result.role });
                toast.success('Login successful!');
                router.push('/dashboard');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error || 'Invalid username or password');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        setLoading(true);
        try {
            const result = await AuthService.register(credentials);
            toast.success('Registration successful! Please login.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error?.response?.data?.error || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        setUser(null);
        router.push('/login');
    };

    return { user, loading, login, register, logout };
};
