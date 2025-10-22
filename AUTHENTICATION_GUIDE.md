# 🔐 Authentication System Integration Guide

This guide explains how to use the comprehensive authentication system integrated with your Mmeraki frontend.

## 📁 File Structure

```
src/
├── lib/
│   ├── api.ts                 # Centralized API client
│   └── authService.ts         # Authentication service
├── context/
│   └── AuthContext.tsx        # React context for auth state
├── hooks/
│   └── useAuthActions.ts      # Enhanced auth actions hook
├── components/
│   ├── LoginDialog.tsx        # Login/signup dialog
│   ├── ProtectedRoute.tsx     # Route protection component
│   └── AuthExample.tsx        # Example usage component
```

## 🚀 Quick Start

### 1. Basic Authentication

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.full_name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Enhanced Authentication Actions

```tsx
import { useAuthActions } from '@/hooks/useAuthActions';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    canAccessAdmin,
    getUserDisplayName
  } = useAuthActions();

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful:', result.user);
    } else {
      console.error('Login failed:', result.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Hello, {getUserDisplayName()}!</h1>
          {canAccessAdmin() && <p>Admin access granted</p>}
        </div>
      ) : (
        <button onClick={() => handleLogin('user@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

## 🛡️ Protected Routes

### Basic Protection

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <div>
      <ProtectedRoute>
        <h1>This content is only visible to authenticated users</h1>
      </ProtectedRoute>
    </div>
  );
}
```

### Admin-Only Protection

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminPanel() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <h1>Admin Dashboard</h1>
      <p>Only admins can see this content</p>
    </ProtectedRoute>
  );
}
```

### Custom Fallback

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function MyProtectedPage() {
  return (
    <ProtectedRoute 
      fallback={
        <div className="text-center">
          <h2>Please log in to continue</h2>
          <button>Go to Login</button>
        </div>
      }
    >
      <h1>Protected Content</h1>
    </ProtectedRoute>
  );
}
```

## 🔧 API Integration

### Direct Service Usage

```tsx
import { authService } from '@/lib/authService';

// Register a new user
const registerUser = async (userData) => {
  const result = await authService.register({
    full_name: 'John Doe',
    email: 'john@example.com',
    password: 'securepassword',
    current_location: 'Delhi'
  });
  
  if (result.success) {
    console.log('User registered:', result.user);
  } else {
    console.error('Registration failed:', result.message);
  }
};

// Login user
const loginUser = async (email, password) => {
  const result = await authService.login({ email, password });
  
  if (result.success) {
    console.log('Login successful:', result.user);
  } else {
    console.error('Login failed:', result.message);
  }
};

// Check authentication status
if (authService.isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}
```

### Using the API Client

```tsx
import { api } from '@/lib/api';

// The API client automatically includes the auth token
const fetchUserProfile = async () => {
  try {
    const profile = await api.get('/auth/profile');
    console.log('User profile:', profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

// Make authenticated requests
const updateUserData = async (data) => {
  try {
    const result = await api.put('/auth/profile', data);
    console.log('Profile updated:', result);
  } catch (error) {
    console.error('Update failed:', error);
  }
};
```

## 🎯 Common Patterns

### 1. Login Form

```tsx
import { useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';

function LoginForm() {
  const { login } = useAuthActions();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirect or update UI
      console.log('Login successful');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        placeholder="Password"
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Profile Management

```tsx
import { useState, useEffect } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';

function ProfilePage() {
  const { user, updateProfile, refreshUser } = useAuthActions();
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    current_location: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        current_location: user.current_location || ''
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    
    if (result.success) {
      console.log('Profile updated successfully');
    } else {
      console.error('Update failed:', result.message);
    }
  };

  const handleRefresh = async () => {
    const result = await refreshUser();
    if (result.success) {
      console.log('User data refreshed');
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <form onSubmit={handleUpdate}>
        <input
          value={formData.full_name}
          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
          placeholder="Full Name"
        />
        <input
          value={formData.phone_number}
          onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
          placeholder="Phone Number"
        />
        <select
          value={formData.current_location}
          onChange={(e) => setFormData(prev => ({ ...prev, current_location: e.target.value }))}
        >
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
```

### 3. Admin-Only Components

```tsx
import { useAuthActions } from '@/hooks/useAuthActions';

function AdminButton() {
  const { canAccessAdmin, user } = useAuthActions();

  if (!canAccessAdmin()) {
    return null; // Don't render for non-admin users
  }

  return (
    <button className="admin-button">
      Admin Action
    </button>
  );
}

// Or with conditional rendering
function AdminPanel() {
  const { canAccessAdmin } = useAuthActions();

  return (
    <div>
      <h1>Dashboard</h1>
      {canAccessAdmin() && (
        <div className="admin-section">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View Reports</button>
        </div>
      )}
    </div>
  );
}
```

## 🔑 Environment Variables

Make sure you have the following environment variables set:

```env
VITE_API_URL=https://mmeraki-backend1.vercel.app
VITE_ADMIN_EMAILS=admin@example.com,superadmin@example.com
```

## 🚨 Error Handling

The authentication system includes comprehensive error handling:

```tsx
import { useAuthActions } from '@/hooks/useAuthActions';

function MyComponent() {
  const { login, updateProfile } = useAuthActions();

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    
    if (!result.success) {
      // Handle different error types
      if (result.message.includes('Invalid credentials')) {
        // Show specific error for wrong password
        alert('Wrong email or password');
      } else if (result.message.includes('Network error')) {
        // Handle network issues
        alert('Please check your internet connection');
      } else {
        // Generic error handling
        alert(result.message);
      }
    }
  };
}
```

## 🔄 Token Management

The system automatically handles token management:

- **Storage**: Tokens are stored in localStorage
- **Refresh**: Automatic token verification on app startup
- **Expiration**: Automatic cleanup when tokens expire
- **Headers**: Automatic inclusion in API requests

## 🎨 UI Components

### Available Components

1. **LoginDialog**: Complete login/signup modal
2. **ProtectedRoute**: Route protection wrapper
3. **AuthExample**: Comprehensive example component

### Styling

All components use your existing Tailwind CSS classes and follow your design system. The authentication components are styled to match your pink/purple theme.

## 🧪 Testing

Use the `AuthExample` component to test all authentication features:

```tsx
import AuthExample from '@/components/AuthExample';

function TestPage() {
  return <AuthExample />;
}
```

## 📚 API Reference

### AuthService Methods

- `register(userData)`: Register new user
- `login(credentials)`: Login user
- `getProfile()`: Get user profile
- `verifyToken()`: Verify token validity
- `updateProfile(data)`: Update user profile
- `setToken(token)`: Set authentication token
- `getToken()`: Get current token
- `clearToken()`: Clear token (logout)
- `isAuthenticated()`: Check if user is authenticated
- `isAdmin(user)`: Check if user is admin
- `refreshUser()`: Refresh user data from server
- `handleTokenExpiration()`: Handle token expiration

### useAuthActions Hook

- `user`: Current user object
- `isAuthenticated`: Authentication status
- `login(email, password)`: Login function
- `register(userData)`: Register function
- `logout()`: Logout function
- `refreshUser()`: Refresh user data
- `updateProfile(data)`: Update profile
- `verifyAndRefreshToken()`: Verify and refresh token
- `hasPermission(permission)`: Check permission
- `canAccessAdmin()`: Check admin access
- `getUserDisplayName()`: Get display name
- `getUserInitials()`: Get user initials

## 🚀 Deployment

The authentication system is ready for production use. Make sure to:

1. Set the correct `VITE_API_URL` environment variable
2. Configure admin emails in `VITE_ADMIN_EMAILS`
3. Test all authentication flows
4. Verify token handling works correctly

## 🆘 Troubleshooting

### Common Issues

1. **Token not being sent**: Check if `localStorage` is available
2. **API calls failing**: Verify `VITE_API_URL` is set correctly
3. **Admin access not working**: Check `VITE_ADMIN_EMAILS` configuration
4. **Login not persisting**: Ensure token is being stored in localStorage

### Debug Mode

Enable debug logging by adding this to your console:

```javascript
localStorage.setItem('debug', 'auth:*');
```

This will show detailed authentication logs in the browser console.

---

## 🎉 You're All Set!

Your authentication system is now fully integrated and ready to use. The system provides:

- ✅ Complete user authentication (login/register/logout)
- ✅ Token-based authentication with automatic header injection
- ✅ Protected routes and admin access control
- ✅ Profile management and user data updates
- ✅ Comprehensive error handling and user feedback
- ✅ TypeScript support with full type definitions
- ✅ Seamless integration with your existing UI components

Start using the authentication system in your components and enjoy a secure, user-friendly authentication experience! 🚀
