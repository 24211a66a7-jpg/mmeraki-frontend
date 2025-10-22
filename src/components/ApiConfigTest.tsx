import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

const ApiConfigTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApiConfig = async () => {
    setIsLoading(true);
    try {
      // Test basic connectivity
      const healthResponse = await api.get('/health');
      
      // Test experiences endpoint
      const experiencesResponse = await api.get('/experiences');
      
      // Test featured experiences
      const featuredResponse = await api.get('/experiences/featured');

      setTestResults({
        success: true,
        config: {
          baseUrl: (api as any).baseUrl,
          hasToken: !!localStorage.getItem('token'),
          token: localStorage.getItem('token')?.substring(0, 20) + '...',
        },
        tests: {
          health: healthResponse,
          experiences: experiencesResponse,
          featured: featuredResponse,
        }
      });
    } catch (error: any) {
      setTestResults({
        success: false,
        error: error.message,
        config: {
          baseUrl: (api as any).baseUrl,
          hasToken: !!localStorage.getItem('token'),
          token: localStorage.getItem('token')?.substring(0, 20) + '...',
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 API Configuration Test
            <Badge variant="outline">Backend: https://mmeraki-backend1.vercel.app</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Current Configuration</h4>
              <div className="text-sm space-y-1">
                <div><strong>Base URL:</strong> {(api as any).baseUrl}</div>
                <div><strong>Has Token:</strong> {localStorage.getItem('token') ? '✅ Yes' : '❌ No'}</div>
                <div><strong>Token Preview:</strong> {localStorage.getItem('token')?.substring(0, 20) + '...' || 'None'}</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Request Headers</h4>
              <div className="text-sm space-y-1">
                <div><strong>Content-Type:</strong> application/json</div>
                <div><strong>Credentials:</strong> include</div>
                <div><strong>Authorization:</strong> {localStorage.getItem('token') ? 'Bearer &lt;token&gt;' : 'Not set'}</div>
              </div>
            </div>
          </div>

          <Button 
            onClick={testApiConfig} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing API...' : 'Test API Configuration'}
          </Button>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Testing API endpoints...</p>
            </div>
          )}

          {testResults && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results:</h3>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  API Configuration
                  <Badge variant={testResults.success ? "default" : "destructive"}>
                    {testResults.success ? "✅ Working" : "❌ Failed"}
                  </Badge>
                </h4>
                
                <div className="text-sm space-y-1">
                  <div><strong>Base URL:</strong> {testResults.config.baseUrl}</div>
                  <div><strong>Has Token:</strong> {testResults.config.hasToken ? '✅ Yes' : '❌ No'}</div>
                  <div><strong>Token Preview:</strong> {testResults.config.token || 'None'}</div>
                </div>
              </div>

              {testResults.success && testResults.tests && (
                <div className="space-y-2">
                  <h4 className="font-medium">Endpoint Tests:</h4>
                  {Object.entries(testResults.tests).map(([key, value]) => (
                    <div key={key} className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="font-medium text-green-800">✅ {key}</div>
                      <div className="text-sm text-green-600">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!testResults.success && testResults.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <h4 className="font-medium text-red-800 mb-2">❌ Error</h4>
                  <p className="text-sm text-red-600">{testResults.error}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiConfigTest;
