const axios = require('axios');

const AVALANCHE_RPC_URL = 'https://api.avax.network/ext/bc/P';

async function testPChainAPI() {
  console.log('Testing Avalanche P-Chain API endpoints...\n');

  try {
    // Test platform.getBlockchains
    console.log('1. Testing platform.getBlockchains...');
    const blockchainResponse = await axios.post(AVALANCHE_RPC_URL, {
      jsonrpc: '2.0',
      method: 'platform.getBlockchains',
      params: {},
      id: 1
    });

    console.log('✅ platform.getBlockchains successful');
    console.log(`Found ${blockchainResponse.data.result.blockchains.length} blockchains`);
    console.log('Sample blockchain:', JSON.stringify(blockchainResponse.data.result.blockchains[0], null, 2));
    console.log('');

    // Test platform.getSubnets
    console.log('2. Testing platform.getSubnets...');
    const subnetResponse = await axios.post(AVALANCHE_RPC_URL, {
      jsonrpc: '2.0',
      method: 'platform.getSubnets',
      params: {},
      id: 2
    });

    console.log('✅ platform.getSubnets successful');
    console.log(`Found ${subnetResponse.data.result.subnets.length} subnets`);
    console.log('Sample subnet:', JSON.stringify(subnetResponse.data.result.subnets[0], null, 2));
    console.log('');

    console.log('🎉 All API tests passed!');

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
  }
}

testPChainAPI();