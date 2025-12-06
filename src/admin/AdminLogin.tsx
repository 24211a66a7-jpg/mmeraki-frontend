import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

// Use logo from public root so it can be swapped without rebuild
const logoImage = '/mmerakilogo1.png';

const AdminLogin: React.FC = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as any;

  useEffect(() => {
    // Check if user has admin role in database AND is the specific admin email
    const hasAdminRole = user?.role === 'admin';
    const isAdminEmail = user?.email === 'mmeraki.event@gmail.com';
    const isAuthorizedAdmin = hasAdminRole && isAdminEmail;

    if (isAuthenticated && isAuthorizedAdmin) {
      const to = (location.state && location.state.from && location.state.from.pathname) ? location.state.from.pathname : '/admin/events';
      navigate(to, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use admin login endpoint with API client
      type AdminLoginResponse = {
        success: boolean;
        token?: string;
        user?: { full_name?: string };
        message?: string;
      };

      const data = await api.post('/auth/admin/login', { email, password }) as AdminLoginResponse;

      if (data && data.success) {
        // Store token
        if (data.token) {
          localStorage.setItem('token', data.token);
        }

        // Show success message
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, ${data.user?.full_name ?? 'Admin'}!`,
        });

        // Redirect to admin events 
        const to = (location.state && location.state.from && location.state.from.pathname) ? location.state.from.pathname : '/admin/events';
        navigate(to, { replace: true });
      } else {
        // Show error message
        toast({
          title: "Admin Login Failed",
          description: data?.message || 'Invalid admin credentials',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Admin Login Error",
        description: error.message || 'Failed to connect to server. Please try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-pink-50">
      <Card className="w-full max-w-md border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-pink-50">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <img
              src={logoImage}
              alt="Mmeraki Logo"
              className="h-16 w-auto object-contain"
            />
            <CardTitle className="text-center text-amber-800">Admin Login</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Admin Portal Access
            </p>
            <p className="text-xs text-gray-500">
              Only authorized administrators can access this area
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mmeraki.event@gmail.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Need admin access? Contact system administrator</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


