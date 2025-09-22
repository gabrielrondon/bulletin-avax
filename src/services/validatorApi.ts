interface ValidatorMetrics {
  nodeID: string;
  l1Id: string;
  l1Name: string;
  stakeAmount: string;
  stakeAmountAVAX: number;
  delegatedStake: string;
  delegatedStakeAVAX: number;
  totalStake: string;
  totalStakeAVAX: number;
  uptime: number;
  uptimeRank: number;
  validationPeriod: {
    startTime: string;
    endTime: string;
    duration: number; // days
  };
  commission: number;
  delegationFee: number;
  capacity: number; // percentage of max delegation
  isActive: boolean;
  missedBlocks: number;
  proposedBlocks: number;
  responseTime: number; // milliseconds
  location: {
    country: string;
    region: string;
    coordinates?: [number, number];
  };
  performance: {
    score: number; // 0-100
    reliability: 'excellent' | 'good' | 'fair' | 'poor';
    profitability: number; // estimated APY
    riskLevel: 'low' | 'medium' | 'high';
  };
  rewards: {
    totalEarned: string;
    dailyAverage: string;
    projectedAPY: number;
  };
  delegators: {
    count: number;
    averageStake: string;
    topDelegation: string;
  };
  socialMetrics: {
    website?: string;
    twitter?: string;
    discord?: string;
    reputation: number; // 0-100
  };
}

interface StakingOpportunity {
  nodeID: string;
  validatorName: string;
  l1Name: string;
  projectedAPY: number;
  commission: number;
  delegationCapacity: number;
  minimumStake: string;
  riskScore: number; // 0-100, lower is better
  recommendationScore: number; // 0-100, higher is better
  pros: string[];
  cons: string[];
  estimatedRewards: {
    daily: string;
    monthly: string;
    yearly: string;
  };
}

interface ValidatorRanking {
  rank: number;
  nodeID: string;
  validatorName: string;
  l1Name: string;
  totalScore: number;
  metrics: {
    uptime: number;
    reliability: number;
    profitability: number;
    capacity: number;
    reputation: number;
  };
  change24h: number; // rank change
}

interface StakingAnalytics {
  totalValidators: number;
  totalStaked: string;
  averageUptime: number;
  averageCommission: number;
  topPerformers: ValidatorRanking[];
  stakingOpportunities: StakingOpportunity[];
  networkDistribution: {
    l1Name: string;
    validatorCount: number;
    totalStake: string;
    averageAPY: number;
  }[];
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}

interface DelegationRecommendation {
  strategy: 'conservative' | 'balanced' | 'aggressive';
  allocations: Array<{
    nodeID: string;
    validatorName: string;
    percentage: number;
    amount: string;
    reasoning: string;
  }>;
  expectedAPY: number;
  riskLevel: string;
  diversificationScore: number;
}

class ValidatorApiService {
  private readonly API_BASE = 'https://api.avax.network/ext/validators';
  private validatorCache = new Map<string, ValidatorMetrics[]>();
  private analyticsCache: StakingAnalytics | null = null;
  private listeners = new Set<(type: string, data: any) => void>();

  async getValidatorMetrics(l1Id?: string): Promise<ValidatorMetrics[]> {
    try {
      // Simulate comprehensive validator data
      const validators = this.generateValidatorMetrics(l1Id);

      if (l1Id) {
        this.validatorCache.set(l1Id, validators);
      }

      return validators;
    } catch (error) {
      throw new Error(`Failed to fetch validator metrics: ${error}`);
    }
  }

  async getStakingAnalytics(): Promise<StakingAnalytics> {
    try {
      if (this.analyticsCache) {
        return this.analyticsCache;
      }

      const allValidators = await this.getValidatorMetrics();
      const analytics = this.calculateStakingAnalytics(allValidators);

      this.analyticsCache = analytics;
      return analytics;
    } catch (error) {
      throw new Error(`Failed to fetch staking analytics: ${error}`);
    }
  }

  async getValidatorRankings(sortBy: 'performance' | 'uptime' | 'profitability' | 'capacity' = 'performance'): Promise<ValidatorRanking[]> {
    try {
      const validators = await this.getValidatorMetrics();
      return this.calculateRankings(validators, sortBy);
    } catch (error) {
      throw new Error(`Failed to fetch validator rankings: ${error}`);
    }
  }

  async getStakingOpportunities(amount: number, riskTolerance: 'low' | 'medium' | 'high' = 'medium'): Promise<StakingOpportunity[]> {
    try {
      const validators = await this.getValidatorMetrics();
      return this.findStakingOpportunities(validators, amount, riskTolerance);
    } catch (error) {
      throw new Error(`Failed to find staking opportunities: ${error}`);
    }
  }

  async getDelegationRecommendations(
    amount: number,
    strategy: 'conservative' | 'balanced' | 'aggressive' = 'balanced'
  ): Promise<DelegationRecommendation> {
    try {
      const opportunities = await this.getStakingOpportunities(amount, strategy === 'conservative' ? 'low' : strategy === 'aggressive' ? 'high' : 'medium');
      return this.generateDelegationStrategy(opportunities, amount, strategy);
    } catch (error) {
      throw new Error(`Failed to generate delegation recommendations: ${error}`);
    }
  }

  async getValidatorProfile(nodeID: string): Promise<ValidatorMetrics | null> {
    try {
      const validators = await this.getValidatorMetrics();
      return validators.find(v => v.nodeID === nodeID) || null;
    } catch (error) {
      throw new Error(`Failed to fetch validator profile: ${error}`);
    }
  }

  // Real-time validator monitoring
  startValidatorMonitoring(interval = 30000) { // 30 seconds
    return setInterval(async () => {
      try {
        const analytics = await this.getStakingAnalytics();
        this.notifyListeners('analytics', analytics);

        const rankings = await this.getValidatorRankings();
        this.notifyListeners('rankings', rankings);
      } catch (error) {
        console.error('Validator monitoring failed:', error);
      }
    }, interval);
  }

  stopValidatorMonitoring(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId);
  }

  subscribeToValidators(callback: (type: string, data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(type: string, data: any) {
    this.listeners.forEach(listener => listener(type, data));
  }

  // Helper methods for generating realistic data
  private generateValidatorMetrics(l1Id?: string): ValidatorMetrics[] {
    const l1Names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK', 'Numbers Protocol'];
    const validatorNames = ['Avalanche Foundation', 'Coinbase Validator', 'Kraken Staking', 'Figment', 'P2P Validator', 'Everstake', 'Stakin', 'ChainFlow', 'Delight Labs', 'NodeReal'];
    const countries = ['United States', 'Germany', 'Singapore', 'Canada', 'United Kingdom', 'Netherlands', 'Japan', 'Switzerland'];

    const count = l1Id ? Math.floor(Math.random() * 15) + 5 : 50;

    return Array.from({ length: count }, (_, i) => {
      const stakeAVAX = Math.random() * 500000 + 2000; // 2K - 502K AVAX
      const delegatedAVAX = Math.random() * 2000000 + 10000; // 10K - 2.01M AVAX
      const totalAVAX = stakeAVAX + delegatedAVAX;
      const uptime = 99 + Math.random() * 1; // 99-100%
      const commission = Math.random() * 10; // 0-10%
      const performance = this.calculatePerformanceScore(uptime, commission, totalAVAX);

      return {
        nodeID: `NodeID-${this.generateRandomNodeId()}`,
        l1Id: l1Id || `l1_${i}`,
        l1Name: l1Names[Math.floor(Math.random() * l1Names.length)],
        stakeAmount: `${this.formatAVAX(stakeAVAX)}`,
        stakeAmountAVAX: stakeAVAX,
        delegatedStake: `${this.formatAVAX(delegatedAVAX)}`,
        delegatedStakeAVAX: delegatedAVAX,
        totalStake: `${this.formatAVAX(totalAVAX)}`,
        totalStakeAVAX: totalAVAX,
        uptime: uptime,
        uptimeRank: Math.floor(Math.random() * 100) + 1,
        validationPeriod: {
          startTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          duration: Math.floor(Math.random() * 365) + 30
        },
        commission: commission,
        delegationFee: commission + Math.random() * 2,
        capacity: Math.random() * 100,
        isActive: Math.random() > 0.05, // 95% active
        missedBlocks: Math.floor(Math.random() * 50),
        proposedBlocks: Math.floor(Math.random() * 1000) + 100,
        responseTime: Math.random() * 200 + 50, // 50-250ms
        location: {
          country: countries[Math.floor(Math.random() * countries.length)],
          region: 'North America', // Simplified
          coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180]
        },
        performance: {
          score: performance,
          reliability: this.getReliabilityRating(uptime),
          profitability: this.calculateAPY(commission, uptime),
          riskLevel: this.getRiskLevel(uptime, commission, totalAVAX)
        },
        rewards: {
          totalEarned: `${this.formatAVAX(totalAVAX * 0.1 * Math.random())}`,
          dailyAverage: `${this.formatAVAX(totalAVAX * 0.0003)}`,
          projectedAPY: this.calculateAPY(commission, uptime)
        },
        delegators: {
          count: Math.floor(Math.random() * 500) + 10,
          averageStake: `${this.formatAVAX(delegatedAVAX / (Math.floor(Math.random() * 50) + 10))}`,
          topDelegation: `${this.formatAVAX(delegatedAVAX * 0.3)}`
        },
        socialMetrics: {
          website: Math.random() > 0.5 ? `https://${validatorNames[i % validatorNames.length].toLowerCase().replace(' ', '')}.com` : undefined,
          twitter: Math.random() > 0.6 ? `@${validatorNames[i % validatorNames.length].replace(' ', '')}` : undefined,
          reputation: Math.floor(Math.random() * 40) + 60 // 60-100
        }
      };
    });
  }

  private calculateStakingAnalytics(validators: ValidatorMetrics[]): StakingAnalytics {
    const totalStaked = validators.reduce((sum, v) => sum + v.totalStakeAVAX, 0);
    const averageUptime = validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length;
    const averageCommission = validators.reduce((sum, v) => sum + v.commission, 0) / validators.length;

    const rankings = this.calculateRankings(validators, 'performance');
    const opportunities = this.findStakingOpportunities(validators, 100000, 'medium');

    // Group by L1
    const l1Distribution = validators.reduce((acc: any, validator) => {
      const existing = acc.find((item: any) => item.l1Name === validator.l1Name);
      if (existing) {
        existing.validatorCount += 1;
        existing.totalStake += validator.totalStakeAVAX;
        existing.totalAPY += validator.performance.profitability;
      } else {
        acc.push({
          l1Name: validator.l1Name,
          validatorCount: 1,
          totalStake: validator.totalStakeAVAX,
          totalAPY: validator.performance.profitability
        });
      }
      return acc;
    }, []).map((item: any) => ({
      ...item,
      totalStake: this.formatAVAX(item.totalStake),
      averageAPY: item.totalAPY / item.validatorCount
    }));

    // Risk distribution
    const riskCounts = validators.reduce((acc: any, v) => {
      acc[v.performance.riskLevel]++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    return {
      totalValidators: validators.length,
      totalStaked: this.formatAVAX(totalStaked),
      averageUptime: averageUptime,
      averageCommission: averageCommission,
      topPerformers: rankings.slice(0, 10),
      stakingOpportunities: opportunities.slice(0, 5),
      networkDistribution: l1Distribution,
      riskDistribution: riskCounts
    };
  }

  private calculateRankings(validators: ValidatorMetrics[], sortBy: string): ValidatorRanking[] {
    return validators
      .map((validator, index) => ({
        rank: 0, // Will be set after sorting
        nodeID: validator.nodeID,
        validatorName: validator.nodeID.substring(7, 20),
        l1Name: validator.l1Name,
        totalScore: validator.performance.score,
        metrics: {
          uptime: validator.uptime,
          reliability: validator.performance.score,
          profitability: validator.performance.profitability,
          capacity: 100 - validator.capacity,
          reputation: validator.socialMetrics.reputation
        },
        change24h: Math.floor(Math.random() * 21) - 10 // -10 to +10
      }))
      .sort((a, b) => {
        switch (sortBy) {
          case 'uptime': return b.metrics.uptime - a.metrics.uptime;
          case 'profitability': return b.metrics.profitability - a.metrics.profitability;
          case 'capacity': return b.metrics.capacity - a.metrics.capacity;
          default: return b.totalScore - a.totalScore;
        }
      })
      .map((validator, index) => ({ ...validator, rank: index + 1 }));
  }

  private findStakingOpportunities(validators: ValidatorMetrics[], amount: number, riskTolerance: string): StakingOpportunity[] {
    return validators
      .filter(v => v.isActive && v.capacity < 90) // Available capacity
      .filter(v => {
        switch (riskTolerance) {
          case 'low': return v.performance.riskLevel === 'low';
          case 'high': return true;
          default: return v.performance.riskLevel !== 'high';
        }
      })
      .map(v => ({
        nodeID: v.nodeID,
        validatorName: v.nodeID.substring(7, 20),
        l1Name: v.l1Name,
        projectedAPY: v.performance.profitability,
        commission: v.commission,
        delegationCapacity: 100 - v.capacity,
        minimumStake: '25 AVAX',
        riskScore: this.calculateRiskScore(v),
        recommendationScore: this.calculateRecommendationScore(v, amount),
        pros: this.generatePros(v),
        cons: this.generateCons(v),
        estimatedRewards: {
          daily: this.formatAVAX(amount * v.performance.profitability / 100 / 365),
          monthly: this.formatAVAX(amount * v.performance.profitability / 100 / 12),
          yearly: this.formatAVAX(amount * v.performance.profitability / 100)
        }
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);
  }

  private generateDelegationStrategy(opportunities: StakingOpportunity[], amount: number, strategy: string): DelegationRecommendation {
    const selectedValidators = opportunities.slice(0, strategy === 'conservative' ? 2 : strategy === 'aggressive' ? 1 : 3);

    let allocations;
    switch (strategy) {
      case 'conservative':
        allocations = selectedValidators.map((v, i) => ({
          nodeID: v.nodeID,
          validatorName: v.validatorName,
          percentage: i === 0 ? 60 : 40,
          amount: this.formatAVAX(amount * (i === 0 ? 0.6 : 0.4)),
          reasoning: i === 0 ? 'Primary allocation to highest-rated validator' : 'Secondary allocation for diversification'
        }));
        break;
      case 'aggressive':
        allocations = [{
          nodeID: selectedValidators[0].nodeID,
          validatorName: selectedValidators[0].validatorName,
          percentage: 100,
          amount: this.formatAVAX(amount),
          reasoning: 'Full allocation to highest-yield validator'
        }];
        break;
      default: // balanced
        allocations = selectedValidators.map((v, i) => ({
          nodeID: v.nodeID,
          validatorName: v.validatorName,
          percentage: i === 0 ? 50 : 25,
          amount: this.formatAVAX(amount * (i === 0 ? 0.5 : 0.25)),
          reasoning: i === 0 ? 'Primary allocation' : 'Diversification allocation'
        }));
    }

    const expectedAPY = allocations.reduce((sum, alloc) => {
      const validator = selectedValidators.find(v => v.nodeID === alloc.nodeID);
      return sum + (validator ? validator.projectedAPY * alloc.percentage / 100 : 0);
    }, 0);

    return {
      strategy: strategy as 'conservative' | 'balanced' | 'aggressive',
      allocations,
      expectedAPY,
      riskLevel: strategy,
      diversificationScore: allocations.length * 20 // Simple score
    };
  }

  // Utility methods
  private calculatePerformanceScore(uptime: number, commission: number, totalStake: number): number {
    const uptimeScore = (uptime - 99) * 50; // 0-50 points
    const commissionScore = (10 - commission) * 3; // 0-30 points
    const stakeScore = Math.min(totalStake / 100000, 1) * 20; // 0-20 points
    return Math.min(100, uptimeScore + commissionScore + stakeScore);
  }

  private getReliabilityRating(uptime: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (uptime >= 99.8) return 'excellent';
    if (uptime >= 99.5) return 'good';
    if (uptime >= 99.0) return 'fair';
    return 'poor';
  }

  private calculateAPY(commission: number, uptime: number): number {
    const baseAPY = 8; // Base APY for validation
    const performanceMultiplier = uptime / 100;
    const commissionReduction = commission / 100;
    return baseAPY * performanceMultiplier * (1 - commissionReduction);
  }

  private getRiskLevel(uptime: number, commission: number, totalStake: number): 'low' | 'medium' | 'high' {
    const riskScore = (100 - uptime) * 2 + commission + (totalStake < 50000 ? 20 : 0);
    if (riskScore < 5) return 'low';
    if (riskScore < 15) return 'medium';
    return 'high';
  }

  private calculateRiskScore(validator: ValidatorMetrics): number {
    let score = 0;
    score += (100 - validator.uptime) * 10; // Uptime risk
    score += validator.commission; // Commission risk
    score += validator.capacity > 80 ? 20 : 0; // Capacity risk
    score += validator.totalStakeAVAX < 50000 ? 15 : 0; // Stake size risk
    return Math.min(100, score);
  }

  private calculateRecommendationScore(validator: ValidatorMetrics, amount: number): number {
    let score = validator.performance.score;
    score += validator.capacity < 50 ? 10 : 0; // Bonus for available capacity
    score += validator.socialMetrics.reputation > 80 ? 5 : 0; // Reputation bonus
    score -= validator.commission > 5 ? 10 : 0; // High commission penalty
    return Math.max(0, Math.min(100, score));
  }

  private generatePros(validator: ValidatorMetrics): string[] {
    const pros = [];
    if (validator.uptime > 99.5) pros.push('Excellent uptime record');
    if (validator.commission < 3) pros.push('Low commission rate');
    if (validator.capacity < 70) pros.push('Good delegation capacity available');
    if (validator.socialMetrics.reputation > 80) pros.push('Strong community reputation');
    if (validator.performance.profitability > 7) pros.push('High projected returns');
    return pros.slice(0, 3);
  }

  private generateCons(validator: ValidatorMetrics): string[] {
    const cons = [];
    if (validator.uptime < 99.2) cons.push('Below-average uptime');
    if (validator.commission > 6) cons.push('High commission rate');
    if (validator.capacity > 85) cons.push('Limited delegation capacity');
    if (validator.totalStakeAVAX < 100000) cons.push('Relatively small validator');
    if (validator.performance.riskLevel === 'high') cons.push('Higher risk profile');
    return cons.slice(0, 2);
  }

  private formatAVAX(amount: number): string {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(2)}M AVAX`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K AVAX`;
    } else {
      return `${amount.toFixed(2)} AVAX`;
    }
  }

  private generateRandomNodeId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
}

export const validatorApi = new ValidatorApiService();
export type { ValidatorMetrics, StakingOpportunity, ValidatorRanking, StakingAnalytics, DelegationRecommendation };