const axios = require('axios');

async function testLocalAPI() {
  const baseUrl = 'http://localhost:5000';

  try {
    console.log('Testing local API endpoints...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/`);
    console.log('✅ Health endpoint successful');
    console.log('Response:', JSON.stringify(healthResponse.data, null, 2));
    console.log('');

    // Test L1s endpoint
    console.log('2. Testing L1s endpoint...');
    const l1sResponse = await axios.get(`${baseUrl}/api/l1s`);
    console.log('✅ L1s endpoint successful');
    console.log(`Found ${l1sResponse.data.total} L1s`);
    console.log('Sample L1:', JSON.stringify(l1sResponse.data.l1s[0], null, 2));
    console.log('');

    console.log('🎉 All local API tests passed!');

  } catch (error) {
    console.error('❌ Local API test failed:', error.response?.data || error.message);
  }
}

testLocalAPI();