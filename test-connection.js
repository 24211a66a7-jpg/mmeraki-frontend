// Simple script to test backend connection
const http = require('http');

const API_URL = 'http://localhost:3001';

async function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${API_URL}${path}`;
    console.log(`\n📡 Testing: ${description}`);
    console.log(`   URL: ${url}`);
    
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`   ✅ SUCCESS (${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            console.log(`   Response:`, JSON.stringify(json, null, 2).split('\n').slice(0, 5).join('\n   '));
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
          resolve({ success: true, status: res.statusCode });
        } else {
          console.log(`   ⚠️  WARNING (${res.statusCode})`);
          resolve({ success: false, status: res.statusCode });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ERROR: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`   ❌ TIMEOUT: Request took too long`);
      resolve({ success: false, error: 'timeout' });
    });
  });
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 Backend Connection Test');
  console.log('═══════════════════════════════════════════════════════');
  
  const tests = [
    { path: '/', description: 'Root endpoint' },
    { path: '/health', description: 'Health check' },
    { path: '/api/experiences', description: 'Experiences API' },
  ];
  
  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    results.push({ ...test, ...result });
  }
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════════════════════');
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n   Total Tests: ${results.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Make sure:');
    console.log('   1. Backend is running on http://localhost:3001');
    console.log('   2. Run: cd backend && npm run dev');
    console.log('   3. Check backend/.env file has correct Supabase credentials');
    process.exit(1);
  } else {
    console.log('\n✅ All tests passed! Backend is running correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Start frontend: npm run dev');
    console.log('   2. Open http://localhost:8080 in your browser');
    process.exit(0);
  }
}

console.log('Waiting 2 seconds before starting tests...\n');
setTimeout(runTests, 2000);

