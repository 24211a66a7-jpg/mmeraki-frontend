import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // Check if user has admin role in database
  const hasAdminRole = user.role === 'admin';
  
  // Check if user is the specific admin email
  const isAdminEmail = user.email === 'mmeraki.event@gmail.com';
  
  // User must have both admin role AND be the specific admin email
  const isAuthorizedAdmin = hasAdminRole && isAdminEmail;

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-sm">
              You don't have permission to access the admin portal. 
              Only authorized administrators can access this area.
            </p>
          </div>
          <div className="text-gray-600 text-sm">
            <p>Current user: {user.email}</p>
            <p>Role: {user.role || 'user'}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RequireAdmin;


