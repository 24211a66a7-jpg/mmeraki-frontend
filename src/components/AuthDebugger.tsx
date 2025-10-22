import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/authService';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Debug component to test authentication system and identify issues
 */
const AuthDebugger: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const results: Record<string, any> = {};

    try {
      // Test 1: Check environment variables
      results.environment = {
        apiUrl: import.meta.env.VITE_API_URL,
        adminEmails: import.meta.env.VITE_ADMIN_EMAILS,
        nodeEnv: import.meta.env.NODE_ENV,
        mode: import.meta.env.MODE,
      };

      // Test 2: Check localStorage
      results.localStorage = {
        hasToken: !!localStorage.getItem('token'),
        tokenValue: localStorage.getItem('token')?.substring(0, 20) + '...',
        hasUser: !!localStorage.getItem('user'),
      };

      // Test 3: Test API client
      try {
        const healthResponse = await api.get('/health');
        results.apiHealth = {
          success: true,
          status: healthResponse,
        };
      } catch (error: any) {
        results.apiHealth = {
          success: false,
          error: error.message,
          status: error.status,
        };
      }

      // Test 4: Test auth service
      try {
        const isAuth = authService.isAuthenticated();
        const token = authService.getToken();
        results.authService = {
          isAuthenticated: isAuth,
          hasToken: !!token,
          tokenLength: token?.length || 0,
        };
      } catch (error: any) {
        results.authService = {
          success: false,
          error: error.message,
        };
      }

      // Test 5: Test API endpoints (if authenticated)
      if (isAuthenticated) {
        try {
          const profileResponse = await api.get('/auth/profile');
          results.profileEndpoint = {
            success: true,
            hasUser: !!profileResponse.user,
            userEmail: profileResponse.user?.email,
          };
        } catch (error: any) {
          results.profileEndpoint = {
            success: false,
            error: error.message,
            status: error.status,
          };
        }

        try {
          const verifyResponse = await api.get('/auth/verify');
          results.verifyEndpoint = {
            success: true,
            isValid: verifyResponse.success,
          };
        } catch (error: any) {
          results.verifyEndpoint = {
            success: false,
            error: error.message,
            status: error.status,
          };
        }
      }

      // Test 6: Test login endpoint (with invalid credentials)
      try {
        const loginResponse = await api.post('/auth/login', {
          email: 'test@example.com',
          password: 'wrongpassword',
        });
        results.loginEndpoint = {
          success: true,
          response: loginResponse,
        };
      } catch (error: any) {
        results.loginEndpoint = {
          success: false,
          error: error.message,
          status: error.status,
          isExpected: error.status === 401,
        };
      }

    } catch (error: any) {
      results.generalError = {
        message: error.message,
        stack: error.stack,
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getStatusIcon = (success: boolean, isExpected?: boolean) => {
    if (success) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (isExpected) {
      return <CheckCircle className="w-4 h-4 text-yellow-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (success: boolean, isExpected?: boolean) => {
    if (success) {
      return <Badge className="bg-green-100 text-green-800">Success</Badge>;
    } else if (isExpected) {
      return <Badge className="bg-yellow-100 text-yellow-800">Expected</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
    }
  };

  useEffect(() => {
    runTests();
  }, [isAuthenticated]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Authentication Debugger
            </CardTitle>
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run Tests'
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Auth State */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Current Authentication State</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isAuthenticated ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Loading: {isLoading ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center gap-2">
                {user ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>User Data: {user ? 'Yes' : 'No'}</span>
              </div>
            </div>
            {user && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p><strong>User:</strong> {user.full_name} ({user.email})</p>
                <p><strong>Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>Location:</strong> {user.current_location}</p>
              </div>
            )}
          </div>

          {/* Test Results */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Test Results</h3>
            <div className="space-y-4">
              {Object.entries(testResults).map(([key, result]) => (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      {getStatusBadge(result.success, result.isExpected)}
                    </div>
                    <div className="space-y-2">
                      {result.success !== undefined && (
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.success, result.isExpected)}
                          <span className="text-sm">
                            {result.success ? 'Working correctly' : 
                             result.isExpected ? 'Expected failure' : 'Failed'}
                          </span>
                        </div>
                      )}
                      {result.error && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertDescription className="text-sm">
                            <strong>Error:</strong> {result.error}
                          </AlertDescription>
                        </Alert>
                      )}
                      {result.status && (
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {result.status}
                        </p>
                      )}
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            <div className="space-y-2">
              {!testResults.environment?.apiUrl && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription>
                    <strong>Missing API URL:</strong> Set VITE_API_URL in your .env file
                  </AlertDescription>
                </Alert>
              )}
              {!testResults.apiHealth?.success && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <strong>API Connection Failed:</strong> Check if your backend is running and accessible
                  </AlertDescription>
                </Alert>
              )}
              {testResults.loginEndpoint?.success === false && !testResults.loginEndpoint?.isExpected && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <strong>Login Endpoint Error:</strong> Check your backend authentication routes
                  </AlertDescription>
                </Alert>
              )}
              {testResults.profileEndpoint?.success === false && isAuthenticated && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <strong>Profile Endpoint Error:</strong> Check your authentication middleware and profile route
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebugger;
