import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/authService';
import { toast } from '@/hooks/use-toast';

export const useAuthActions = () => {
  const { user, isAuthenticated, login: contextLogin, register: contextRegister, logout: contextLogout } = useAuth();

  /**
   * Enhanced login with additional error handling
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await contextLogin(email, password);
      return { success: true, user: result.user, token: result.token };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }, [contextLogin]);

  /**
   * Enhanced registration with additional error handling
   */
  const register = useCallback(async (userData: {
    full_name: string;
    email: string;
    phone_number?: string;
    password: string;
    current_location?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    date_of_birth?: string;
  }) => {
    try {
      await contextRegister(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  }, [contextRegister]);

  /**
   * Logout with cleanup
   */
  const logout = useCallback(async () => {
    try {
      contextLogout();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Logout failed' };
    }
  }, [contextLogout]);

  /**
   * Refresh user data from server
   */
  const refreshUser = useCallback(async () => {
    if (!isAuthenticated) return { success: false, message: 'Not authenticated' };
    
    try {
      const userData = await authService.refreshUser();
      if (userData) {
        return { success: true, user: userData };
      } else {
        return { success: false, message: 'Failed to refresh user data' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to refresh user data' };
    }
  }, [isAuthenticated]);

  /**
   * Check if user has specific permission
   */
  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    
    // Add your permission logic here
    // For now, just check if user is admin for admin permissions
    if (permission === 'admin') {
      return user.isAdmin || false;
    }
    
    return true; // Default to true for other permissions
  }, [user]);

  /**
   * Check if user can access admin features
   */
  const canAccessAdmin = useCallback(() => {
    return hasPermission('admin');
  }, [hasPermission]);

  /**
   * Get user display name
   */
  const getUserDisplayName = useCallback(() => {
    if (!user) return 'Guest';
    return user.full_name || user.email || 'User';
  }, [user]);

  /**
   * Get user initials for avatar
   */
  const getUserInitials = useCallback(() => {
    if (!user) return 'G';
    const name = user.full_name || user.email || 'User';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  /**
   * Update user profile with toast notifications
   */
  const updateProfile = useCallback(async (updateData: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const result = await authService.updateProfile(updateData);
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        return { success: true, user: result.user };
      } else {
        toast({
          title: "Update Failed",
          description: result.message || "Failed to update profile.",
          variant: "destructive",
        });
        return { success: false, message: result.message };
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      return { success: false, message: error.message };
    }
  }, [isAuthenticated]);

  /**
   * Verify token and handle expiration
   */
  const verifyAndRefreshToken = useCallback(async () => {
    if (!isAuthenticated) return { success: false, message: 'Not authenticated' };
    
    try {
      const result = await authService.verifyToken();
      if (result.success) {
        return { success: true };
      } else {
        // Token is invalid, clear it
        authService.clearToken();
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        return { success: false, message: 'Token expired' };
      }
    } catch (error: any) {
      authService.clearToken();
      return { success: false, message: error.message || 'Token verification failed' };
    }
  }, [isAuthenticated]);

  return {
    // Auth state
    user,
    isAuthenticated,
    
    // Auth actions
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    verifyAndRefreshToken,
    
    // Utility functions
    hasPermission,
    canAccessAdmin,
    getUserDisplayName,
    getUserInitials,
  };
};
