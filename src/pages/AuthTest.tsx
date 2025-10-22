import React from 'react';
import AuthExample from '@/components/AuthExample';

/**
 * Test page for the authentication system
 * Add this route to your App.tsx to test authentication features
 * 
 * Usage: Add <Route path="/auth-test" element={<AuthTest />} /> to your routes
 */
const AuthTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔐 Authentication System Test
          </h1>
          <p className="text-lg text-gray-600">
            Test all authentication features and see how they work
          </p>
        </div>
        
        <AuthExample />
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            This page demonstrates the complete authentication system integration.
            <br />
            You can remove this page once you're satisfied with the implementation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthTest;
