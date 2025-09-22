import React, { useState, useEffect } from 'react';
import { icmApi, ICMMessage, ICMRoute, ICMAnalytics } from '../services/icmApi';

interface ICMHubProps {
  l1Networks: Array<{ id: string; name: string }>;
}

const ICMHub: React.FC<ICMHubProps> = ({ l1Networks }) => {
  const [messages, setMessages] = useState<ICMMessage[]>([]);
  const [routes, setRoutes] = useState<ICMRoute[]>([]);
  const [analytics, setAnalytics] = useState<ICMAnalytics | null>(null);
  const [messageFlow, setMessageFlow] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'messages' | 'routes' | 'flow'>('overview');
  const [selectedRoute, setSelectedRoute] = useState<ICMRoute | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    fetchICMData();

    if (isMonitoring) {
      const unsubscribe = icmApi.subscribeToICM((type, data) => {
        switch (type) {
          case 'messages':
            setMessages(data);
            break;
          case 'routes':
            setRoutes(data);
            break;
          case 'analytics':
            setAnalytics(data);
            break;
        }
      });

      const intervalId = icmApi.startICMMonitoring(10000); // Update every 10 seconds

      return () => {
        unsubscribe();
        icmApi.stopICMMonitoring(intervalId);
      };
    }
  }, [isMonitoring]);

  const fetchICMData = async () => {
    try {
      setLoading(true);
      const [messagesData, routesData, analyticsData, flowData] = await Promise.all([
        icmApi.getICMMessages(undefined, 50),
        icmApi.getICMRoutes(),
        icmApi.getICMAnalytics(),
        icmApi.getMessageFlow()
      ]);

      setMessages(messagesData);
      setRoutes(routesData);
      setAnalytics(analyticsData);
      setMessageFlow(flowData);
    } catch (error) {
      console.error('Failed to fetch ICM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ICMMessage['status']) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRouteHealthColor = (health: ICMRoute['routeHealth']) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'failing': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatLatency = (latency: number) => {
    if (latency < 1000) return `${latency.toFixed(0)}ms`;
    return `${(latency / 1000).toFixed(1)}s`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ICM Hub</h2>
            <p className="text-gray-600">Interchain Communication Analytics & Monitoring</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Real-time Toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isMonitoring}
                onChange={(e) => setIsMonitoring(e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Live Monitor</span>
              {isMonitoring && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </label>

            {/* View Selector */}
            <select
              value={activeView}
              onChange={(e) => setActiveView(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
            >
              <option value="overview">Overview</option>
              <option value="messages">Recent Messages</option>
              <option value="routes">Active Routes</option>
              <option value="flow">Message Flow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Messages (24h)</h3>
            <p className="text-2xl font-bold text-blue-600">{analytics.totalMessages24h}</p>
            <p className="text-xs text-gray-500 mt-1">Across all L1s</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Routes</h3>
            <p className="text-2xl font-bold text-green-600">
              {analytics.activeRoutes}/{analytics.totalRoutes}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cross-chain connections</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Latency</h3>
            <p className="text-2xl font-bold text-purple-600">
              {formatLatency(analytics.avgCrossChainLatency)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cross-chain delivery</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Network Health</h3>
            <p className="text-2xl font-bold text-green-600">
              {analytics.networkEfficiency.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Overall efficiency</p>
          </div>
        </div>
      )}

      {/* Main Content based on active view */}
      {activeView === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Routes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Routes (24h)</h3>
            <div className="space-y-3">
              {analytics.topRoutes.map((route, index) => (
                <div key={route.route} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{route.route}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-600 font-semibold">{route.volume} msgs</span>
                    <span className="text-gray-500">{formatLatency(route.latency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Types</h3>
            <div className="space-y-4">
              {Object.entries(analytics.messageTypeDistribution).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(count / Math.max(...Object.values(analytics.messageTypeDistribution))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Messages View */}
      {activeView === 'messages' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent ICM Messages</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Latency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.slice(0, 20).map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{message.sourceL1}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm font-medium text-gray-900">{message.destinationL1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">
                        {message.messageType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatLatency(message.latency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {message.fees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routes View */}
      {activeView === 'routes' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active ICM Routes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages (24h)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Latency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Failure Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volume
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routes.filter(r => r.isActive).map((route) => (
                  <tr
                    key={`${route.sourceL1}-${route.destinationL1}`}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedRoute(route)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-blue-600">{route.sourceL1}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-sm font-medium text-blue-600">{route.destinationL1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRouteHealthColor(route.routeHealth)}`}>
                        {route.routeHealth}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.messagesLast24h}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatLatency(route.avgLatency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.failureRate.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.totalVolume}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Flow Visualization */}
      {activeView === 'flow' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Message Flow Visualization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {messageFlow.slice(0, 12).map((flow, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-600">{flow.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-green-600">{flow.to}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Messages:</span>
                    <span className="font-medium">{flow.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Volume:</span>
                    <span className="font-medium">{flow.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Latency:</span>
                    <span className="font-medium">{formatLatency(flow.avgLatency)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route Detail Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={() => setSelectedRoute(null)}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex items-center justify-between pb-4 border-b">
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedRoute.sourceL1} → {selectedRoute.destinationL1}
                </h3>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Health Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getRouteHealthColor(selectedRoute.routeHealth)}`}>
                      {selectedRoute.routeHealth}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Active:</span>
                    <span className="ml-2 font-medium">{selectedRoute.isActive ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Messages (24h):</span>
                    <span className="ml-2 font-medium">{selectedRoute.messagesLast24h}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg Latency:</span>
                    <span className="ml-2 font-medium">{formatLatency(selectedRoute.avgLatency)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Failure Rate:</span>
                    <span className="ml-2 font-medium">{selectedRoute.failureRate.toFixed(2)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Volume:</span>
                    <span className="ml-2 font-medium">{selectedRoute.totalVolume}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <span className="text-sm text-gray-500">Last Message:</span>
                  <span className="ml-2 text-sm font-medium">
                    {new Date(selectedRoute.lastMessage).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ICMHub;