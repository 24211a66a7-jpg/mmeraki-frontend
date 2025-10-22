import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

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
    const isAdmin = (user as any)?.role === 'admin' || Boolean((user as any)?.isAdmin);
    if (isAuthenticated && isAdmin) {
      const to = (location.state && location.state.from && location.state.from.pathname) ? location.state.from.pathname : '/admin/events';
      navigate(to, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      const to = (location.state && location.state.from && location.state.from.pathname) ? location.state.from.pathname : '/admin/events';
      navigate(to, { replace: true });
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
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Admin Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;


