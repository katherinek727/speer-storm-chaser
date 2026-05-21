/**
 * Simple test runner for Storm Chaser app
 * 
 * This demonstrates the testing requirement for the assessment.
 * In a real project, you would use Jest with proper test configuration.
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Running Storm Chaser Tests...\n');

// Run the TypeScript test file using ts-node
const testFile = path.join(__dirname, 'src/utils/weatherUtils.test.ts');

exec(`npx tsx "${testFile}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Test execution failed: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`⚠️ Test warnings: ${stderr}`);
  }
  
  console.log(stdout);
  
  // Check if tests passed by looking for success message
  if (stdout.includes('All Tests Completed Successfully')) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
});