const axios = require('axios');

class AvalancheService {
  constructor() {
    this.rpcUrl = process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/P';
  }

  async makeRPCCall(method, params = {}) {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        method,
        params,
        id: Date.now()
      });
      return response.data.result;
    } catch (error) {
      console.error(`RPC call failed for ${method}:`, error.message);
      throw error;
    }
  }

  async getBlockchains() {
    return await this.makeRPCCall('platform.getBlockchains');
  }

  async getSubnets() {
    return await this.makeRPCCall('platform.getSubnets');
  }

  async getL1Data() {
    try {
      // For MVP, use mock data due to API rate limits
      // In production, this would fetch from the real API
      const mockL1Data = [
        {
          id: "XhmBdBFhFrsLeUnjrNkPu7ptUs8w5HYVkxN7XvETmtJYZWEVw",
          name: "km2",
          subnetID: "Eu2nGvNwpr9n5rXN4Zsv6C5iPw24rWbTz2Tisdo3Jhtog9Dzd",
          vmID: "pK4t1ySBpm7SENQ5iUMPtEF8b7SVW1SDv7uqz4tCYZLV17Z9P",
          validatorCount: 12,
          status: "active",
          icmEnabled: true
        },
        {
          id: "2oYMqpc5u36BTMxp3wPwwfWLKjVMdFNmMpJ5U7PCa4KDDfSdJ",
          name: "DeFi Kingdoms",
          subnetID: "Vn3aX6hNRstj5VHHm63TCgPNaeGnRSqCYXQqemSqDd2TBH49p",
          vmID: "mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6",
          validatorCount: 8,
          status: "active",
          icmEnabled: false
        },
        {
          id: "2Z7F4sRXj1Jj1cVFMxM6nKPGGV6b6pQKF4J8wRYQCt1N4VBN",
          name: "Beam",
          subnetID: "4p6sHdSh5jS6F3K4P4T6jY7i4J4m4L4H8Y4J4m4L4H8Y4J4m",
          vmID: "mRN7Z9bJ6KLmN4P6sJ6F3K4P4T6jY7i4J4m4L4H8Y4J4m4L",
          validatorCount: 15,
          status: "active",
          icmEnabled: true
        },
        {
          id: "3Z8G5tSk2Kk2dWGMxN7oLQHGGW7c7qRLG5K9xSZRDu2O5WCO",
          name: "Swimmer Network",
          subnetID: "5q7tHeEi6kS7G4K5Q5U7kZ8j5K5n5M5I9Z5K5n5M5I9Z5K5n",
          vmID: "nSO8A0cK7LnO5Q7sK7G4K5Q5U7kZ8j5K5n5M5I9Z5K5n5M",
          validatorCount: 6,
          status: "active",
          icmEnabled: false
        },
        {
          id: "4A9H6uTl3Ll3eXHNyO8pMRIHHX8d8rSMH6L0ySaSEv3P6XDP",
          name: "Dexalot",
          subnetID: "6r8uIfFj7lT8H5L6R6V8lA9k6L6o6N6J0A6L6o6N6J0A6L6o",
          vmID: "oTP9B1dL8MoP6R8sL8H5L6R6V8lA9k6L6o6N6J0A6L6o6N",
          validatorCount: 10,
          status: "active",
          icmEnabled: true
        }
      ];

      return {
        l1s: mockL1Data,
        total: mockL1Data.length,
        lastUpdated: new Date().toISOString()
      };

      // Commented out real API call for now due to rate limits
      // const blockchains = await this.getBlockchains();
      // const l1Data = blockchains.blockchains.map(blockchain => ({
      //   id: blockchain.id,
      //   name: blockchain.name,
      //   subnetID: blockchain.subnetID,
      //   vmID: blockchain.vmID,
      //   validatorCount: 0,
      //   status: 'unknown',
      //   icmEnabled: false
      // }));
      // return {
      //   l1s: l1Data,
      //   total: l1Data.length,
      //   lastUpdated: new Date().toISOString()
      // };
    } catch (error) {
      console.error('Failed to get L1 data:', error.message);
      throw error;
    }
  }
}

module.exports = new AvalancheService();