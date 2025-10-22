import React, { useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, MapPin, Calendar, Shield, LogOut, RefreshCw } from 'lucide-react';

/**
 * Example component demonstrating how to use the authentication system
 * This shows various authentication features and patterns
 */
const AuthExample: React.FC = () => {
  const {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    verifyAndRefreshToken,
    hasPermission,
    canAccessAdmin,
    getUserDisplayName,
    getUserInitials,
  } = useAuthActions();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    full_name: '',
    email: '',
    password: '',
    current_location: 'Delhi',
  });
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
    current_location: user?.current_location || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      showMessage('success', `Welcome back, ${result.user?.full_name}!`);
      setLoginForm({ email: '', password: '' });
    } else {
      showMessage('error', result.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await register(registerForm);
    if (result.success) {
      showMessage('success', 'Account created successfully!');
      setRegisterForm({ full_name: '', email: '', password: '', current_location: 'Delhi' });
    } else {
      showMessage('error', result.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      showMessage('success', 'Logged out successfully');
    } else {
      showMessage('error', result.message || 'Logout failed');
    }
  };

  const handleRefreshUser = async () => {
    setLoading(true);
    const result = await refreshUser();
    if (result.success) {
      showMessage('success', 'User data refreshed');
    } else {
      showMessage('error', result.message || 'Failed to refresh user data');
    }
    setLoading(false);
  };

  const handleVerifyToken = async () => {
    setLoading(true);
    const result = await verifyAndRefreshToken();
    if (result.success) {
      showMessage('success', 'Token is valid');
    } else {
      showMessage('error', result.message || 'Token verification failed');
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await updateProfile(profileForm);
    if (result.success) {
      showMessage('success', 'Profile updated successfully!');
      setProfileForm({
        full_name: result.user?.full_name || '',
        phone_number: result.user?.phone_number || '',
        current_location: result.user?.current_location || '',
      });
    } else {
      showMessage('error', result.message || 'Profile update failed');
    }
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Demo
            </CardTitle>
            <CardDescription>
              Please log in or register to access the full authentication features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {message && (
              <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Login Form */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Login</h3>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Your password"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </div>

              {/* Register Form */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Register</h3>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Full Name</Label>
                    <Input
                      id="register-name"
                      value={registerForm.full_name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-location">Location</Label>
                    <select
                      id="register-location"
                      value={registerForm.current_location}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, current_location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Hyderabad">Hyderabad</option>
                    </select>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating account...' : 'Register'}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold text-lg">
                {getUserInitials()}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getUserDisplayName()}
                  {canAccessAdmin() && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Admin
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {user?.current_location || 'Not specified'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {user?.phone_number || 'No phone number'}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              {user?.is_verified ? 'Verified' : 'Not verified'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Actions</CardTitle>
          <CardDescription>Test various authentication features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleRefreshUser} disabled={loading} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh User Data
            </Button>
            <Button onClick={handleVerifyToken} disabled={loading} variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Verify Token
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Modify your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <Label htmlFor="profile-phone">Phone Number</Label>
                <Input
                  id="profile-phone"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
              <div>
                <Label htmlFor="profile-location">Location</Label>
                <select
                  id="profile-location"
                  value={profileForm.current_location}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, current_location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Permissions Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions & Access</CardTitle>
          <CardDescription>Current user permissions and access levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Admin Access:</span>
              <Badge variant={canAccessAdmin() ? 'default' : 'secondary'}>
                {canAccessAdmin() ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Can Edit Profile:</span>
              <Badge variant={hasPermission('edit_profile') ? 'default' : 'secondary'}>
                {hasPermission('edit_profile') ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Can View Orders:</span>
              <Badge variant={hasPermission('view_orders') ? 'default' : 'secondary'}>
                {hasPermission('view_orders') ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthExample;
