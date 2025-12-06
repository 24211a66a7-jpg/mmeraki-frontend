import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';

// Use logo from public root so it can be swapped without rebuild
const logoImage = '/mmerakilogo1.png';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose }) => {
  const { login, register, isLoading } = useAuth();
  const { selectedLocation } = useLocation();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Signup form state - simplified
  const [signupForm, setSignupForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    current_location: selectedLocation,
    agreeToTerms: false
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(loginForm.email, loginForm.password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!signupForm.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      await register({
        full_name: signupForm.full_name,
        email: signupForm.email,
        password: signupForm.password,
        current_location: signupForm.current_location || 'Delhi'
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    if (activeTab === 'login') {
      setLoginForm(prev => ({ ...prev, [field]: value }));
    } else {
      setSignupForm(prev => ({ ...prev, [field]: value }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl border border-pink-200 overflow-hidden max-w-md w-full">
        {/* Cute gradient header */}
        <div className="h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
        
        <div className="p-6">
          {/* Cute header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="Mmeraki Logo" 
                className="h-12 w-auto object-contain"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Welcome! ✨
              </h3>
            </div>
            <button 
              aria-label="Close" 
              className="p-2 rounded-full hover:bg-pink-50 transition-colors" 
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-pink-50">
              <TabsTrigger value="login" className="text-sm py-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg">
                Login 😊
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm py-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white rounded-lg">
                Sign Up 🌟
              </TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50" variant="destructive">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="login" className="mt-0 space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Your password"
                        className="pl-10 pr-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-pink-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-pink-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <a href="#" className="text-pink-500 hover:underline font-medium">Forgot password?</a>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-10 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In 🚀'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 space-y-4">
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullName" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="signup-fullName"
                        value={signupForm.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Your full name"
                        className="pl-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                        className="pl-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-location" className="text-sm font-medium text-gray-700">Location</Label>
                    <select
                      id="signup-location"
                      value={signupForm.current_location}
                      onChange={(e) => handleInputChange('current_location', e.target.value)}
                      className="w-full px-3 py-2 h-10 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-200 focus:border-pink-400 text-sm"
                    >
                      <option value="Delhi">🏙️ Delhi</option>
                      <option value="Hyderabad">🏛️ Hyderabad</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password"
                        className="pl-10 pr-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-pink-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-pink-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 w-4 h-4" />
                      <Input
                        id="signup-confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 h-10 rounded-xl border-pink-200 focus:border-pink-400 focus:ring-pink-200"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="agree-terms" 
                    checked={signupForm.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                    className="mt-1 border-pink-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                  <Label htmlFor="agree-terms" className="text-xs text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-pink-500 hover:underline font-medium">Terms & Conditions</a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-pink-500 hover:underline font-medium">Privacy Policy</a>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white h-10 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account 🎉'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;


