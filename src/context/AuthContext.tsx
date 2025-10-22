import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  profile_icon?: string;
  current_location: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  date_of_birth?: string;
  wishlisted_items: string[];
  past_orders: any[];
  cart_items: any[];
  payment_methods: any[];
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  register: (userData: {
    full_name: string;
    email: string;
    phone_number?: string;
    password: string;
    current_location?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    date_of_birth?: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  });

  const verifyToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await api.request<any>('/auth/verify', { method: 'GET' });

      if (response?.success) {
        const profileData = await api.get<any>('/auth/profile');
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
        const isAdmin = profileData.user?.role === 'admin' || (!!profileData.user?.email && adminEmails.includes(String(profileData.user.email).toLowerCase()));
        setState({
          user: { ...profileData.user, isAdmin },
          isLoading: false,
          isAuthenticated: true,
        });
        return true;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }

    // If verification fails, clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    return false;
  }, []);

  useEffect(() => {
    // Check for stored token and verify it
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [verifyToken]);

  const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const data = await api.post<any>('/auth/login', { email, password });
      if (data.success) {
        // Store token
        localStorage.setItem('token', data.token);
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
        const isAdmin = data.user?.role === 'admin' || (!!data.user?.email && adminEmails.includes(String(data.user.email).toLowerCase()));
        const nextUser = { ...data.user, isAdmin } as User;
        setState({ user: nextUser, isLoading: false, isAuthenticated: true });
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${data.user.full_name}`,
        });
        return { user: nextUser, token: data.token as string };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: {
    full_name: string;
    email: string;
    phone_number?: string;
    password: string;
    current_location?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    date_of_birth?: string;
  }) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const data = await api.post<any>('/auth/register', userData);
      if (data.success) {
        // Store token
        localStorage.setItem('token', data.token);
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase());
        const isAdmin = data.user?.role === 'admin' || (!!data.user?.email && adminEmails.includes(String(data.user.email).toLowerCase()));
        setState({
          user: { ...data.user, isAdmin },
          isLoading: false,
          isAuthenticated: true,
        });
        
        toast({
          title: "Account created!",
          description: `Welcome to Mmeraki, ${data.user.full_name}!`,
        });
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false }));
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Stateless logout: just clear client auth; backend call not required
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (state.user) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const responseData = await api.put<any>('/auth/profile', data);
        if (responseData.success) {
          setState(prev => ({
            ...prev,
            user: responseData.user
          }));
          
          toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated.",
          });
        } else {
          throw new Error(responseData.message || 'Failed to update profile');
        }
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message || "Failed to update profile.",
          variant: "destructive",
        });
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      updateProfile,
      verifyToken
    }}>
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