import React, { useState, useEffect } from 'react';
import './App.css';
import { avalancheApi } from './services/avalancheApi';

interface Validator {
  nodeID: string;
  stake: string;
  uptime: number;
  connected: boolean;
}

interface L1Network {
  id: string;
  name: string;
  subnetID: string;
  vmID: string;
  validatorCount: number;
  validators?: Validator[];
  status: string;
  icmEnabled: boolean;
  description?: string;
  website?: string;
  tokenSymbol?: string;
  totalSupply?: string;
  createdAt?: string;
  blockHeight?: number;
  lastBlockTime?: string;
  avgBlockTime?: number;
  tps?: number;
}

interface L1Data {
  l1s: L1Network[];
  total: number;
  lastUpdated: string;
}

function App() {
  const [l1Data, setL1Data] = useState<L1Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<L1Network | null>(null);

  useEffect(() => {
    fetchL1Data();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchL1Data = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching real L1 networks from Avalanche API...');

      // Fetch real L1 networks from Avalanche API
      const networks = await avalancheApi.getL1Networks();

      const data: L1Data = {
        l1s: networks,
        total: networks.length,
        lastUpdated: new Date().toISOString()
      };

      setL1Data(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (id: string, type: 'blockchain' | 'subnet') => {
    // Use Avascan.info as the primary explorer since subnets.avax.network might have issues
    const baseUrl = 'https://avascan.info';
    if (type === 'blockchain') {
      return `${baseUrl}/blockchain/${id}`;
    }
    return `${baseUrl}/blockchain/${id}`; // Both cases use blockchain for Avascan
  };

  const openExplorer = (id: string, type: 'blockchain' | 'subnet') => {
    window.open(getExplorerUrl(id, type), '_blank');
  };

  const openNetworkDetails = (network: L1Network) => {
    setSelectedNetwork(network);
  };

  const closeModal = () => {
    setSelectedNetwork(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Avalanche L1 networks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchL1Data}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulletin AVAX</h1>
              <p className="text-gray-600">Avalanche L1 Explorer</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {l1Data?.total} L1 Networks
              </p>
              <p className="text-xs text-gray-400">
                Last updated: {l1Data?.lastUpdated ? new Date(l1Data.lastUpdated).toLocaleTimeString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Layer 1 Networks</h2>
          <p className="text-gray-600">
            Explore all Avalanche Layer 1 blockchains and their network information.
          </p>
        </div>

        {/* L1 Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blockchain ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subnet ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VM ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validators
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {l1Data?.l1s.map((l1) => (
                  <tr key={l1.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openNetworkDetails(l1)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-blue-600 hover:text-blue-800">
                        {l1.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openExplorer(l1.id, 'blockchain');
                        }}
                        className="text-sm bg-gray-100 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        {formatAddress(l1.id)} 🔗
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openExplorer(l1.subnetID, 'subnet');
                        }}
                        className="text-sm bg-gray-100 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
                      >
                        {formatAddress(l1.subnetID)} 🔗
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {formatAddress(l1.vmID)}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {l1.validatorCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        l1.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {l1.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ for the Avalanche ecosystem •
            <a href="https://github.com/gabrielrondon/bulletin-avax" className="text-red-600 hover:text-red-700 ml-1">
              Open Source
            </a>
          </p>
        </div>
      </main>

      {/* Modal for Network Details */}
      {selectedNetwork && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-2xl font-bold text-gray-900">{selectedNetwork.name}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="mt-6 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedNetwork.description}</p>
                </div>

                {/* Token Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Token Information</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Symbol:</span> {selectedNetwork.tokenSymbol}</p>
                      <p><span className="font-medium">Total Supply:</span> {selectedNetwork.totalSupply}</p>
                      <p><span className="font-medium">Created:</span> {selectedNetwork.createdAt}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Network Stats</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Validators:</span> {selectedNetwork.validatorCount}</p>
                      <p><span className="font-medium">Status:</span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedNetwork.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedNetwork.status}
                        </span>
                      </p>
                      <p><span className="font-medium">ICM Enabled:</span> {selectedNetwork.icmEnabled ? '✅ Yes' : '❌ No'}</p>
                      {selectedNetwork.blockHeight && (
                        <p><span className="font-medium">Block Height:</span> {selectedNetwork.blockHeight.toLocaleString()}</p>
                      )}
                      {selectedNetwork.tps && (
                        <p><span className="font-medium">TPS:</span> {selectedNetwork.tps}</p>
                      )}
                      {selectedNetwork.avgBlockTime && (
                        <p><span className="font-medium">Avg Block Time:</span> {selectedNetwork.avgBlockTime}s</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Technical Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Blockchain ID:</span>
                      <button
                        onClick={() => openExplorer(selectedNetwork.id, 'blockchain')}
                        className="text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                      >
                        {formatAddress(selectedNetwork.id)} 🔗
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Subnet ID:</span>
                      <button
                        onClick={() => openExplorer(selectedNetwork.subnetID, 'subnet')}
                        className="text-sm bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded transition-colors"
                      >
                        {formatAddress(selectedNetwork.subnetID)} 🔗
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">VM ID:</span>
                      <code className="text-sm bg-gray-200 px-3 py-1 rounded">
                        {formatAddress(selectedNetwork.vmID)}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Validators Section */}
                {selectedNetwork.validators && selectedNetwork.validators.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Validators</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedNetwork.validators.map((validator, index) => (
                          <div key={validator.nodeID} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                            <div className="flex-1">
                              <code className="text-xs bg-gray-200 px-2 py-1 rounded">
                                {validator.nodeID.substring(0, 20)}...
                              </code>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="font-medium">{validator.stake}</span>
                              <span className={`${validator.uptime >= 99 ? 'text-green-600' : validator.uptime >= 98 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {validator.uptime}%
                              </span>
                              <span className={`w-2 h-2 rounded-full ${validator.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Connected: {selectedNetwork.validators.filter(v => v.connected).length}/{selectedNetwork.validators.length} validators
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  {selectedNetwork.website && (
                    <a
                      href={selectedNetwork.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Visit Website 🌐
                    </a>
                  )}
                  <button
                    onClick={() => openExplorer(selectedNetwork.id, 'blockchain')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    View in Explorer 🔍
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
