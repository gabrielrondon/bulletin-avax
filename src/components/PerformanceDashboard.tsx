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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <p className="text-gray-600">Real-time network metrics and performance monitoring</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Real-time Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isRealTime}
                onChange={(e) => setIsRealTime(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Real-time</span>
              {isRealTime && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </label>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Networks</h3>
          <p className="text-2xl font-bold text-gray-900">{performanceData.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg TPS</h3>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(performanceData.reduce((sum, p) => sum + p.currentTPS, 0) / performanceData.length || 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Block Time</h3>
          <p className="text-2xl font-bold text-blue-600">
            {(performanceData.reduce((sum, p) => sum + p.currentBlockTime, 0) / performanceData.length || 0).toFixed(1)}s
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Networks Online</h3>
          <p className="text-2xl font-bold text-green-600">
            {performanceData.filter(p => p.uptimePercentage > 99).length}/{performanceData.length}
          </p>
        </div>
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Network Performance Metrics</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current TPS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Block Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Network Load
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gas Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Finality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((network) => (
                <tr key={network.l1Id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{network.l1Name}</div>
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