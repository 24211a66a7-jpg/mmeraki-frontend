import { api } from './api';

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
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  phone_number?: string;
  password: string;
  current_location?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  date_of_birth?: string;
}

class AuthService {
  private readonly baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = (import.meta as { env?: { VITE_API_URL?: string } })?.env?.VITE_API_URL || 'https://mmeraki-backend1.vercel.app';
    this.token = this.getStoredToken();
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      
      if (response.success && response.token) {
        this.setToken(response.token);
        return { 
          success: true, 
          user: response.user, 
          token: response.token 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: this.getErrorMessage(error) 
      };
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      if (response.success && response.token) {
        this.setToken(response.token);
        return { 
          success: true, 
          user: response.user, 
          token: response.token 
        };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed' 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        message: this.getErrorMessage(error) 
      };
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>('/auth/profile');
      return response;
    } catch (error: any) {
      return { 
        success: false, 
        message: this.getErrorMessage(error) 
      };
    }
  }

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>('/auth/verify');
      return response;
    } catch (error: any) {
      return { 
        success: false, 
        message: this.getErrorMessage(error) 
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updateData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await api.put<AuthResponse>('/auth/profile', updateData);
      return response;
    } catch (error: any) {
      return { 
        success: false, 
        message: this.getErrorMessage(error) 
      };
    }
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Get stored token (private method)
   */
  private getStoredToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Clear authentication token (logout)
   */
  clearToken(): void {
    this.token = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user is admin
   */
  isAdmin(user?: User): boolean {
    if (!user) return false;
    
    // Check if user has admin role
    if (user.role === 'admin') return true;
    
    // Check against admin emails from environment
    const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((email: string) => email.trim().toLowerCase());
    
    return adminEmails.includes(user.email.toLowerCase());
  }

  /**
   * Get error message from error object
   */
  private getErrorMessage(error: any): string {
    if (error?.message) {
      return error.message;
    }
    if (error?.details?.message) {
      return error.details.message;
    }
    if (error?.status) {
      return `HTTP ${error.status}: ${error.message || 'Request failed'}`;
    }
    return 'Network error: Please check your connection and try again';
  }

  /**
   * Refresh user data from server
   */
  async refreshUser(): Promise<User | null> {
    if (!this.isAuthenticated()) return null;
    
    try {
      const response = await this.getProfile();
      if (response.success && response.user) {
        return response.user;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
    
    return null;
  }

  /**
   * Handle token expiration
   */
  handleTokenExpiration(): void {
    this.clearToken();
    // You can add additional logic here like redirecting to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
