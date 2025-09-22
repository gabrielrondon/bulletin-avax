import React, { useState, useEffect, useCallback } from 'react';
import { validatorApi, StakingAnalytics, ValidatorRanking, StakingOpportunity, DelegationRecommendation } from '../services/validatorApi';

interface ValidatorHubProps {
  l1Networks: Array<{ id: string; name: string }>;
}

const ValidatorHub: React.FC<ValidatorHubProps> = ({ l1Networks }) => {
  const [analytics, setAnalytics] = useState<StakingAnalytics | null>(null);
  const [rankings, setRankings] = useState<ValidatorRanking[]>([]);
  const [opportunities, setOpportunities] = useState<StakingOpportunity[]>([]);
  const [recommendations, setRecommendations] = useState<DelegationRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'rankings' | 'opportunities' | 'calculator'>('overview');
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Calculator states
  const [stakeAmount, setStakeAmount] = useState<number>(10000);
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [strategy, setStrategy] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');

  const fetchValidatorData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsData, rankingsData, opportunitiesData] = await Promise.all([
        validatorApi.getStakingAnalytics(),
        validatorApi.getValidatorRankings(),
        validatorApi.getStakingOpportunities(stakeAmount, riskTolerance)
      ]);

      setAnalytics(analyticsData);
      setRankings(rankingsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Failed to fetch validator data:', error);
    } finally {
      setLoading(false);
    }
  }, [stakeAmount, riskTolerance]);

  useEffect(() => {
    fetchValidatorData();

    if (isMonitoring) {
      const unsubscribe = validatorApi.subscribeToValidators((type, data) => {
        switch (type) {
          case 'analytics':
            setAnalytics(data);
            break;
          case 'rankings':
            setRankings(data);
            break;
        }
      });

      const intervalId = validatorApi.startValidatorMonitoring(30000); // 30 seconds

      return () => {
        unsubscribe();
        validatorApi.stopValidatorMonitoring(intervalId);
      };
    }
  }, [isMonitoring, fetchValidatorData]);

  const handleCalculateRecommendations = async () => {
    try {
      const rec = await validatorApi.getDelegationRecommendations(stakeAmount, strategy);
      setRecommendations(rec);
    } catch (error) {
      console.error('Failed to calculate recommendations:', error);
    }
  };

  const getRankChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return '↗';
    if (change < 0) return '↘';
    return '→';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
            <h2 className="text-2xl font-bold text-gray-900">Validator Intelligence Hub</h2>
            <p className="text-gray-600">Advanced validator analytics, staking opportunities, and delegation strategies</p>
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
              <span className="text-sm text-gray-700">Live Updates</span>
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
              <option value="rankings">Rankings</option>
              <option value="opportunities">Opportunities</option>
              <option value="calculator">Staking Calculator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Validators</h3>
            <p className="text-2xl font-bold text-blue-600">{analytics.totalValidators}</p>
            <p className="text-xs text-gray-500 mt-1">Across all L1s</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Staked</h3>
            <p className="text-2xl font-bold text-green-600">{analytics.totalStaked}</p>
            <p className="text-xs text-gray-500 mt-1">Network security</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Uptime</h3>
            <p className="text-2xl font-bold text-purple-600">{analytics.averageUptime.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">Network reliability</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Commission</h3>
            <p className="text-2xl font-bold text-orange-600">{analytics.averageCommission.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">Delegation cost</p>
          </div>
        </div>
      )}

      {/* Main Content based on active view */}
      {activeView === 'overview' && analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-3">
              {analytics.topPerformers.slice(0, 5).map((validator) => (
                <div key={validator.nodeID} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-blue-600">#{validator.rank}</span>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{validator.validatorName}</span>
                      <p className="text-xs text-gray-500">{validator.l1Name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{validator.totalScore.toFixed(0)}</span>
                    <span className={`text-xs ${getRankChangeColor(validator.change24h)}`}>
                      {getRankChangeIcon(validator.change24h)}{Math.abs(validator.change24h)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Distribution</h3>
            <div className="space-y-4">
              {analytics.networkDistribution.slice(0, 6).map((network) => (
                <div key={network.l1Name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{network.l1Name}</span>
                    <p className="text-xs text-gray-500">{network.validatorCount} validators</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{network.totalStake}</span>
                    <p className="text-xs text-green-600">{network.averageAPY.toFixed(1)}% APY</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">Low Risk</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(analytics.riskDistribution.low / analytics.totalValidators) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{analytics.riskDistribution.low}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-yellow-700">Medium Risk</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(analytics.riskDistribution.medium / analytics.totalValidators) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{analytics.riskDistribution.medium}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-red-700">High Risk</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(analytics.riskDistribution.high / analytics.totalValidators) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{analytics.riskDistribution.high}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Opportunities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Staking Opportunities</h3>
            <div className="space-y-3">
              {analytics.stakingOpportunities.map((opportunity, index) => (
                <div key={opportunity.nodeID} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{opportunity.validatorName}</span>
                    <span className="text-sm font-bold text-green-600">{opportunity.projectedAPY.toFixed(1)}% APY</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{opportunity.l1Name}</span>
                    <span>{opportunity.commission.toFixed(1)}% commission</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rankings View */}
      {activeView === 'rankings' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Validator Rankings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validator</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profitability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankings.slice(0, 20).map((validator) => (
                  <tr key={validator.nodeID} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-blue-600">#{validator.rank}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{validator.validatorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {validator.l1Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {validator.totalScore.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {validator.metrics.uptime.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {validator.metrics.profitability.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRankChangeColor(validator.change24h)}`}>
                        {getRankChangeIcon(validator.change24h)}{Math.abs(validator.change24h)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Opportunities View */}
      {activeView === 'opportunities' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Staking Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {opportunities.slice(0, 12).map((opportunity) => (
              <div key={opportunity.nodeID} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">{opportunity.validatorName}</h4>
                  <span className="text-sm font-bold text-green-600">{opportunity.projectedAPY.toFixed(1)}% APY</span>
                </div>

                <div className="space-y-2 text-xs text-gray-600 mb-3">
                  <div className="flex justify-between">
                    <span>Network:</span>
                    <span className="font-medium">{opportunity.l1Name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission:</span>
                    <span className="font-medium">{opportunity.commission.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">{opportunity.delegationCapacity.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(
                      opportunity.riskScore < 30 ? 'low' : opportunity.riskScore < 60 ? 'medium' : 'high'
                    )}`}>
                      {opportunity.riskScore < 30 ? 'Low' : opportunity.riskScore < 60 ? 'Medium' : 'High'}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-xs text-gray-500 mb-2">Estimated rewards (10K AVAX):</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Daily:</span>
                      <span className="font-medium">{opportunity.estimatedRewards.daily}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly:</span>
                      <span className="font-medium">{opportunity.estimatedRewards.monthly}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staking Calculator */}
      {activeView === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Staking Calculator</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stake Amount (AVAX)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                  min="25"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                <select
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="conservative">Conservative</option>
                  <option value="balanced">Balanced</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>

              <button
                onClick={handleCalculateRecommendations}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Calculate Recommendations
              </button>
            </div>
          </div>

          {recommendations && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delegation Strategy</h3>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Expected APY:</span>
                  <span className="text-lg font-bold text-green-600">{recommendations.expectedAPY.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Risk Level:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(recommendations.riskLevel)}`}>
                    {recommendations.riskLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Diversification:</span>
                  <span className="text-sm font-medium text-gray-900">{recommendations.diversificationScore}/100</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Allocation Strategy:</h4>
                {recommendations.allocations.map((allocation, index) => (
                  <div key={allocation.nodeID} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{allocation.validatorName}</span>
                      <span className="text-sm font-bold text-blue-600">{allocation.percentage}%</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{allocation.amount}</div>
                    <div className="text-xs text-gray-500">{allocation.reasoning}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidatorHub;