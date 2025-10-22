// Test script to verify admin filtering functionality
const API_BASE_URL = 'http://localhost:3001/api';

async function testFiltering() {
  try {
    console.log('Testing admin filtering functionality...\n');
    
    // Test 1: Get all experiences
    console.log('1. Fetching all experiences...');
    const response = await fetch(`${API_BASE_URL}/experiences`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Found ${data.data.length} total experiences`);
      
      // Test 2: Filter by category "birthdays"
      console.log('\n2. Filtering by category "birthdays"...');
      const birthdayExperiences = data.data.filter(exp => exp.category === 'birthdays');
      console.log(`✅ Found ${birthdayExperiences.length} birthday experiences`);
      
      if (birthdayExperiences.length > 0) {
        console.log('Sample birthday experience:', {
          title: birthdayExperiences[0].title,
          category: birthdayExperiences[0].category,
          subcategory: birthdayExperiences[0].subcategory
        });
      }
      
      // Test 3: Filter by subcategory
      console.log('\n3. Filtering by subcategory...');
      const subcategories = [...new Set(data.data.map(exp => exp.subcategory).filter(Boolean))];
      console.log('Available subcategories:', subcategories);
      
      // Test 4: Search functionality
      console.log('\n4. Testing search functionality...');
      const searchTerm = 'birthday';
      const searchResults = data.data.filter(exp => 
        exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.short_desc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log(`✅ Found ${searchResults.length} experiences containing "${searchTerm}"`);
      
      // Test 5: Combined filtering
      console.log('\n5. Testing combined filtering...');
      const combinedResults = data.data.filter(exp => 
        exp.category === 'birthdays' && 
        (exp.title?.toLowerCase().includes('decor') || 
         exp.subcategory?.toLowerCase().includes('decor'))
      );
      console.log(`✅ Found ${combinedResults.length} birthday decoration experiences`);
      
      // Test 6: Show all categories
      console.log('\n6. Available categories:');
      const categories = [...new Set(data.data.map(exp => exp.category))];
      categories.forEach(cat => {
        const count = data.data.filter(exp => exp.category === cat).length;
        console.log(`  - ${cat}: ${count} experiences`);
      });
      
    } else {
      console.error('❌ API response not successful:', data);
    }
    
  } catch (error) {
    console.error('❌ Error testing filtering:', error.message);
  }
}

// Wait for server to start, then test
setTimeout(() => {
  testFiltering();
}, 3000);
