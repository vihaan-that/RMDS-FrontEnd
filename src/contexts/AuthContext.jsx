'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get token from cookie using js-cookie
      const token = Cookies.get('token');
      console.log('Token status:', token ? 'found' : 'not found');
      
      if (token) {
        console.log('Token found:', token);
        // Sync localStorage with cookie
        localStorage.setItem('token', token);
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // localStorage.removeItem('token');
      // Cookies.remove('token', { path: '/' });
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const { token, user: userData } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      // Set token in cookie with 1 hour expiration
      Cookies.set('token', token, { 
        expires: 1/24, // 1 hour in days
        path: '/' 
      });
      setUser(userData);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // localStorage.removeItem('token');
    // Cookies.remove('token', { path: '/' });
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
