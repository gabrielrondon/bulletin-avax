import React, { useState, useEffect } from 'react';
import './App.css';
import { avalancheApi } from './services/avalancheApi';
import PerformanceDashboard from './components/PerformanceDashboard';
import ICMHub from './components/ICMHub';
import ValidatorHub from './components/ValidatorHub';

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
  const [activeTab, setActiveTab] = useState<'explorer' | 'performance' | 'icm' | 'validators'>('explorer');

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-red-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-red-600 mx-auto absolute top-0"></div>
          </div>
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Loading Bulletin AVAX</h2>
            <p className="text-lg text-slate-600">Fetching real-time Avalanche L1 networks...</p>
            <div className="mt-4 bg-red-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-red-200 max-w-md mx-auto">
            <div className="text-6xl mb-4">🚨</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Connection Error</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={fetchL1Data}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Bulletin AVAX
                </h1>
                <p className="text-slate-600 font-medium">Professional Avalanche Ecosystem Analytics</p>
              </div>
            </div>
            <div className="text-right bg-white/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-red-100">
              <p className="text-lg font-bold text-red-600">
                {l1Data?.total} L1 Networks
              </p>
              <p className="text-sm text-slate-500">
                Updated: {l1Data?.lastUpdated ? new Date(l1Data.lastUpdated).toLocaleTimeString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-t border-red-100">
            <nav className="flex space-x-0">
              <button
                onClick={() => setActiveTab('explorer')}
                className={`relative py-4 px-8 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'explorer'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border-r border-red-100'
                }`}
              >
                L1 Explorer
                {activeTab === 'explorer' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`relative py-4 px-8 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'performance'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border-r border-red-100'
                }`}
              >
                Performance
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                  LIVE
                </span>
                {activeTab === 'performance' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('icm')}
                className={`relative py-4 px-8 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'icm'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:text-red-600 hover:bg-red-50 border-r border-red-100'
                }`}
              >
                ICM Hub
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">
                  NEW
                </span>
                {activeTab === 'icm' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('validators')}
                className={`relative py-4 px-8 font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'validators'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-slate-700 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                Validators
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700">
                  PRO
                </span>
                {activeTab === 'validators' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-400"></div>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'explorer' && (
          <>
            <div className="mb-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                  Avalanche Layer 1 Networks
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Explore the complete ecosystem of Avalanche L1 blockchains with real-time data and comprehensive analytics.
                </p>
              </div>
            </div>

            {/* L1 Table */}
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-red-100">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Live Network Data</h3>
                <p className="text-red-100">Real-time information from Avalanche P-Chain</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-red-100">
                  <thead className="bg-gradient-to-r from-slate-50 to-red-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Network Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Blockchain ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Subnet ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        VM ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Validators
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {l1Data?.l1s.map((l1, index) => (
                      <tr key={l1.id} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md" onClick={() => openNetworkDetails(l1)}>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-3 animate-pulse"></div>
                            <div className="font-bold text-slate-900 hover:text-red-600 transition-colors">
                              {l1.name || 'Unknown Network'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openExplorer(l1.id, 'blockchain');
                            }}
                            className="text-sm bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-blue-700 hover:shadow-md"
                          >
                            {formatAddress(l1.id)} 🔗
                          </button>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openExplorer(l1.subnetID, 'subnet');
                            }}
                            className="text-sm bg-gradient-to-r from-emerald-100 to-emerald-200 hover:from-emerald-200 hover:to-emerald-300 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-emerald-700 hover:shadow-md"
                          >
                            {formatAddress(l1.subnetID)} 🔗
                          </button>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <code className="text-sm bg-slate-100 px-3 py-2 rounded-lg font-mono text-slate-600">
                            {formatAddress(l1.vmID)}
                          </code>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-slate-900">{l1.validatorCount}</span>
                            <span className="ml-2 text-sm text-slate-500">nodes</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                            l1.status === 'active'
                              ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
                              : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600'
                          }`}>
                            {l1.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'performance' && l1Data && (
          <PerformanceDashboard
            l1Networks={l1Data.l1s.map(l1 => ({ id: l1.id, name: l1.name }))}
          />
        )}

        {activeTab === 'icm' && l1Data && (
          <ICMHub
            l1Networks={l1Data.l1s.map(l1 => ({ id: l1.id, name: l1.name }))}
          />
        )}

        {activeTab === 'validators' && l1Data && (
          <ValidatorHub
            l1Networks={l1Data.l1s.map(l1 => ({ id: l1.id, name: l1.name }))}
          />
        )}

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-red-100">
            <p className="text-lg text-slate-600 mb-4">
              Built with ❤️ for the Avalanche ecosystem
            </p>
            <div className="flex justify-center items-center space-x-6">
              <a
                href="https://github.com/gabrielrondon/bulletin-avax"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⭐ Star on GitHub
              </a>
              <a
                href="https://avax.network"
                className="inline-flex items-center px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔺 Avalanche Network
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Network Details */}
      {selectedNetwork && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50" onClick={closeModal}>
          <div className="relative top-10 mx-auto p-0 w-11/12 max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border border-red-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">{selectedNetwork.name}</h3>
                      <p className="text-red-100">Layer 1 Network Details</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-red-100 transition-all duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Description */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                    📝 Description
                  </h4>
                  <p className="text-slate-700 text-lg leading-relaxed">{selectedNetwork.description || 'A Layer 1 blockchain on the Avalanche network.'}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                      💎 Token Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Symbol:</span>
                        <span className="font-bold text-emerald-700">{selectedNetwork.tokenSymbol || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Total Supply:</span>
                        <span className="font-bold text-emerald-700">{selectedNetwork.totalSupply || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Created:</span>
                        <span className="font-bold text-emerald-700">{selectedNetwork.createdAt || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                      📊 Network Stats
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Validators:</span>
                        <span className="font-bold text-blue-700">{selectedNetwork.validatorCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Status:</span>
                        <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                          selectedNetwork.status === 'active'
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {selectedNetwork.status === 'active' ? '🟢 Active' : '⚫ Inactive'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-600">ICM Enabled:</span>
                        <span className="font-bold">{selectedNetwork.icmEnabled ? '✅ Yes' : '❌ No'}</span>
                      </div>
                      {selectedNetwork.blockHeight && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-600">Block Height:</span>
                          <span className="font-bold text-blue-700">{selectedNetwork.blockHeight.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedNetwork.tps && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-600">TPS:</span>
                          <span className="font-bold text-blue-700">{selectedNetwork.tps}</span>
                        </div>
                      )}
                      {selectedNetwork.avgBlockTime && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-600">Avg Block Time:</span>
                          <span className="font-bold text-blue-700">{selectedNetwork.avgBlockTime}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    ⚙️ Technical Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                      <span className="font-semibold text-slate-600">Blockchain ID:</span>
                      <button
                        onClick={() => openExplorer(selectedNetwork.id, 'blockchain')}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        {formatAddress(selectedNetwork.id)} 🔗 View
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                      <span className="font-semibold text-slate-600">Subnet ID:</span>
                      <button
                        onClick={() => openExplorer(selectedNetwork.subnetID, 'subnet')}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                      >
                        {formatAddress(selectedNetwork.subnetID)} 🔗 View
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                      <span className="font-semibold text-slate-600">VM ID:</span>
                      <code className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg font-mono font-medium">
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
