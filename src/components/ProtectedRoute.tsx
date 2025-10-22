import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback,
  requireAdmin = false 
}) => {
  const { isAuthenticated, user, isLoading, verifyToken } = useAuth();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        // If we have a user but need to verify admin status
        if (requireAdmin && !user.isAdmin) {
          return;
        }
        return;
      }

      // If not authenticated, try to verify token
      if (!isAuthenticated && !isLoading) {
        setIsVerifying(true);
        try {
          await verifyToken();
        } catch (error) {
          console.error('Token verification failed:', error);
        } finally {
          setIsVerifying(false);
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, isLoading, verifyToken, requireAdmin]);

  // Show loading state
  if (isLoading || isVerifying) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <p className="text-gray-600">Verifying authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Admin required but user is not admin
  if (requireAdmin && (!user || !user.isAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default ProtectedRoute;
