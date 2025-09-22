import React, { useState, useEffect } from 'react';
import { performanceApi, NetworkPerformance } from '../services/performanceApi';

interface PerformanceDashboardProps {
  l1Networks: Array<{ id: string; name: string }>;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ l1Networks }) => {
  const [performanceData, setPerformanceData] = useState<NetworkPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedMetric, setSelectedMetric] = useState<'tps' | 'blockTime' | 'gasPrice'>('tps');
  const [sortBy, setSortBy] = useState<'tps' | 'blockTime' | 'load' | 'uptime'>('tps');
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await performanceApi.getAllNetworkPerformance(
          l1Networks.map(n => n.id)
        );
        setPerformanceData(data);
      } catch (error) {
        console.error('Failed to fetch performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (isRealTime) {
      const unsubscribe = performanceApi.subscribe((data) => {
        setPerformanceData(data);
      });

      const intervalId = performanceApi.startRealTimeUpdates(
        l1Networks.map(n => n.id),
        5000 // Update every 5 seconds
      );

      return () => {
        unsubscribe();
        performanceApi.stopRealTimeUpdates(intervalId);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l1Networks, isRealTime]);


  const sortedData = [...performanceData].sort((a, b) => {
    switch (sortBy) {
      case 'tps':
        return b.currentTPS - a.currentTPS;
      case 'blockTime':
        return a.currentBlockTime - b.currentBlockTime;
      case 'load':
        return a.networkLoad - b.networkLoad;
      case 'uptime':
        return b.uptimePercentage - a.uptimePercentage;
      default:
        return 0;
    }
  });

  const getPerformanceColor = (value: number, metric: string) => {
    switch (metric) {
      case 'tps':
        if (value >= 80) return 'text-green-600';
        if (value >= 40) return 'text-yellow-600';
        return 'text-red-600';
      case 'blockTime':
        if (value <= 2) return 'text-green-600';
        if (value <= 3) return 'text-yellow-600';
        return 'text-red-600';
      case 'load':
        if (value <= 60) return 'text-green-600';
        if (value <= 80) return 'text-yellow-600';
        return 'text-red-600';
      case 'uptime':
        if (value >= 99.5) return 'text-green-600';
        if (value >= 99) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getLoadBarColor = (load: number) => {
    if (load <= 60) return 'bg-green-500';
    if (load <= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-red-100">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gradient-to-r from-red-200 to-red-300 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-red-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
              Performance Dashboard
            </h2>
            <p className="text-xl text-slate-600">Real-time network metrics and performance monitoring</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Real-time Toggle */}
            <label className="flex items-center space-x-3 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 rounded-xl border border-emerald-200">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-lg font-semibold text-emerald-700">Live Updates</span>
              {isRealTime && (
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              )}
            </label>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-xl px-4 py-3 text-lg font-medium focus:ring-red-500 focus:border-red-500 shadow-md"
            >
              <option value="tps">Sort by TPS</option>
              <option value="blockTime">Sort by Block Time</option>
              <option value="load">Sort by Network Load</option>
              <option value="uptime">Sort by Uptime</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg p-6 border border-blue-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-700 mb-1">Total Networks</h3>
              <p className="text-3xl font-bold text-slate-900">{performanceData.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl shadow-lg p-6 border border-emerald-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-emerald-700 mb-1">Avg TPS</h3>
              <p className="text-3xl font-bold text-slate-900">
                {Math.round(performanceData.reduce((sum, p) => sum + p.currentTPS, 0) / performanceData.length || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg p-6 border border-purple-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-700 mb-1">Avg Block Time</h3>
              <p className="text-3xl font-bold text-slate-900">
                {(performanceData.reduce((sum, p) => sum + p.currentBlockTime, 0) / performanceData.length || 0).toFixed(1)}s
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-2xl shadow-lg p-6 border border-orange-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-orange-700 mb-1">Networks Online</h3>
              <p className="text-3xl font-bold text-slate-900">
                {performanceData.filter(p => p.uptimePercentage > 99).length}/{performanceData.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-red-100">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
          <h3 className="text-2xl font-bold text-white">Network Performance Metrics</h3>
          <p className="text-red-100">Live performance data from all L1 networks</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-100">
            <thead className="bg-gradient-to-r from-slate-50 to-red-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Current TPS
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Block Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Network Load
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Gas Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Finality
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {sortedData.map((network) => (
                <tr key={network.l1Id} className="hover:bg-gradient-to-r hover:from-red-50 hover:to-blue-50 transition-all duration-200">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full mr-3 animate-pulse"></div>
                      <div className="font-bold text-slate-900">{network.l1Name}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Updated {new Date(network.lastUpdated).toLocaleTimeString()}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-semibold ${getPerformanceColor(network.currentTPS, 'tps')}`}>
                      {network.currentTPS.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">
                      24h avg: {network.avgTPS24h.toFixed(1)}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-semibold ${getPerformanceColor(network.currentBlockTime, 'blockTime')}`}>
                      {network.currentBlockTime.toFixed(2)}s
                    </div>
                    <div className="text-xs text-gray-500">
                      24h avg: {network.avgBlockTime24h.toFixed(2)}s
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getLoadBarColor(network.networkLoad)}`}
                          style={{ width: `${network.networkLoad}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${getPerformanceColor(network.networkLoad, 'load')}`}>
                        {network.networkLoad}%
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{network.gasPrice}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {network.finalityTime.toFixed(1)}s
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${getPerformanceColor(network.uptimePercentage, 'uptime')}`}>
                      {network.uptimePercentage.toFixed(2)}%
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">TPS Trends (24h)</h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {sortedData.slice(0, 8).map((network, index) => (
              <div key={network.l1Id} className="flex flex-col items-center space-y-2">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{
                    height: `${(network.currentTPS / Math.max(...sortedData.map(n => n.currentTPS))) * 200}px`,
                    width: '24px'
                  }}
                ></div>
                <div className="text-xs text-gray-500 transform -rotate-45 w-16 text-center">
                  {network.l1Name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Health Overview</h3>
          <div className="space-y-4">
            {sortedData.slice(0, 5).map((network) => (
              <div key={network.l1Id} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{network.l1Name}</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${
                      network.uptimePercentage >= 99.5 ? 'bg-green-500' :
                      network.uptimePercentage >= 99 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-xs text-gray-600">{network.uptimePercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;