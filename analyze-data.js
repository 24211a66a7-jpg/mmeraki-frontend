// Analyze the actual data structure to understand categories and subcategories
const API_BASE_URL = 'http://localhost:3001/api';

async function analyzeData() {
  try {
    console.log('Analyzing database structure...\n');
    
    const response = await fetch(`${API_BASE_URL}/experiences`);
    const data = await response.json();
    
    if (data.success) {
      console.log(`Total experiences: ${data.data.length}\n`);
      
      // Analyze categories
      console.log('=== CATEGORIES ===');
      const categoryCounts = {};
      data.data.forEach(exp => {
        categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
      });
      
      Object.entries(categoryCounts).forEach(([category, count]) => {
        console.log(`${category}: ${count} experiences`);
      });
      
      // Analyze subcategories
      console.log('\n=== SUBCATEGORIES ===');
      const subcategoryCounts = {};
      data.data.forEach(exp => {
        if (exp.subcategory) {
          subcategoryCounts[exp.subcategory] = (subcategoryCounts[exp.subcategory] || 0) + 1;
        }
      });
      
      Object.entries(subcategoryCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([subcategory, count]) => {
          console.log(`${subcategory}: ${count} experiences`);
        });
      
      // Find birthday-related experiences
      console.log('\n=== BIRTHDAY-RELATED EXPERIENCES ===');
      const birthdayRelated = data.data.filter(exp => 
        exp.title?.toLowerCase().includes('birthday') ||
        exp.description?.toLowerCase().includes('birthday') ||
        exp.short_desc?.toLowerCase().includes('birthday') ||
        exp.subcategory?.toLowerCase().includes('birthday')
      );
      
      console.log(`Found ${birthdayRelated.length} birthday-related experiences:`);
      birthdayRelated.forEach(exp => {
        console.log(`- ${exp.title} (Category: ${exp.category}, Subcategory: ${exp.subcategory})`);
      });
      
      // Find experiences that should be in birthday category
      console.log('\n=== EXPERIENCES THAT SHOULD BE BIRTHDAY CATEGORY ===');
      const shouldBeBirthday = data.data.filter(exp => 
        exp.subcategory?.toLowerCase().includes('birthday') ||
        exp.title?.toLowerCase().includes('birthday') ||
        exp.description?.toLowerCase().includes('birthday')
      );
      
      console.log(`Found ${shouldBeBirthday.length} experiences that should be in birthday category:`);
      shouldBeBirthday.forEach(exp => {
        console.log(`- ${exp.title}`);
        console.log(`  Current Category: ${exp.category}`);
        console.log(`  Subcategory: ${exp.subcategory}`);
        console.log(`  ID: ${exp.id}`);
        console.log('');
      });
      
    } else {
      console.error('❌ API response not successful:', data);
    }
    
  } catch (error) {
    console.error('❌ Error analyzing data:', error.message);
  }
}

analyzeData();
