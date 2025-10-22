import React from 'react';
import AuthDebugger from '@/components/AuthDebugger';

/**
 * Debug page for testing authentication system
 * Add this route to your App.tsx to test authentication
 * 
 * Usage: Add <Route path="/auth-debug" element={<AuthDebug />} /> to your routes
 */
const AuthDebug: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔧 Authentication Debug Tool
          </h1>
          <p className="text-lg text-gray-600">
            Diagnose and fix authentication issues
          </p>
        </div>
        
        <AuthDebugger />
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            This debug tool helps identify authentication issues.
            <br />
            You can remove this page once issues are resolved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
