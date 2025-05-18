import { create } from 'zustand';
import { AuthState, RegisterData, User } from '../types';
import { jwtDecode } from 'jwt-decode';
import { api } from '../utils/api';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  loading: false,

  initializeAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ user: User }>(token);
        set({ 
          user: decoded.user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem('token');
        set({ 
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.post('/auth/login', { email, password });
      const { token, user } = data;
      */
      
      // Mock login for demo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate creating a JWT token with user data
      const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        country: 'United States',
        createdAt: new Date().toISOString(),
      };
      
      const token = `mock_token_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({
        error: 'Invalid email or password',
        loading: false,
      });
    }
  },

  register: async (userData: RegisterData) => {
    set({ loading: true, error: null });
    try {
      // For demo purposes, simulate API call
      // In production, replace with actual API call to your backend
      /*
      const { data } = await api.post('/auth/register', userData);
      const { token, user } = data;
      */
      
      // Mock registration for demo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate creating a JWT token with user data
      const user = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: userData.email,
        name: userData.name,
        country: userData.country,
        createdAt: new Date().toISOString(),
      };
      
      const token = `mock_token_${Math.random().toString(36).substr(2, 9)}`;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, loading: false });
    } catch (error) {
      set({
        error: 'Failed to register, please try again',
        loading: false,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));