interface NetworkPerformance {
  l1Id: string;
  l1Name: string;
  currentTPS: number;
  avgTPS24h: number;
  currentBlockTime: number;
  avgBlockTime24h: number;
  networkLoad: number; // 0-100 percentage
  gasPrice: string;
  finalityTime: number; // seconds
  uptimePercentage: number;
  lastUpdated: string;
  historical: {
    tps: Array<{ timestamp: string; value: number }>;
    blockTime: Array<{ timestamp: string; value: number }>;
    gasPrice: Array<{ timestamp: string; value: number }>;
  };
}

interface ICMActivity {
  l1Id: string;
  messagesPerHour: number;
  avgMessageLatency: number; // milliseconds
  failureRate: number; // percentage
  connectedL1s: string[];
  lastMessage: string;
}

interface ValidatorPerformance {
  nodeID: string;
  l1Id: string;
  uptime24h: number;
  missedBlocks: number;
  responseTime: number; // milliseconds
  stakeAmount: string;
  commission: number;
  delegationCapacity: number;
  isActive: boolean;
  lastSeen: string;
}

class PerformanceApiService {
  private readonly BASE_URL = 'https://api.avax.network/ext';
  private readonly WS_URL = 'wss://api.avax.network/ext/ws';
  private performanceCache = new Map<string, NetworkPerformance>();
  private listeners = new Set<(data: NetworkPerformance[]) => void>();

  async getNetworkPerformance(l1Id: string): Promise<NetworkPerformance> {
    try {
      // Simulate real-time performance data (in production, this would call actual APIs)
      const cached = this.performanceCache.get(l1Id);
      const now = new Date().toISOString();

      const performance: NetworkPerformance = {
        l1Id,
        l1Name: await this.getL1Name(l1Id),
        currentTPS: this.generateRealisticTPS(l1Id),
        avgTPS24h: cached?.avgTPS24h || this.generateRealisticTPS(l1Id, 0.8),
        currentBlockTime: this.generateRealisticBlockTime(l1Id),
        avgBlockTime24h: cached?.avgBlockTime24h || 2.1,
        networkLoad: Math.floor(Math.random() * 100),
        gasPrice: this.generateGasPrice(l1Id),
        finalityTime: Math.random() * 3 + 1, // 1-4 seconds
        uptimePercentage: 99.5 + Math.random() * 0.5, // 99.5-100%
        lastUpdated: now,
        historical: this.generateHistoricalData(cached?.historical)
      };

      this.performanceCache.set(l1Id, performance);
      return performance;
    } catch (error) {
      throw new Error(`Failed to fetch performance data: ${error}`);
    }
  }

  async getAllNetworkPerformance(l1Ids: string[]): Promise<NetworkPerformance[]> {
    const performances = await Promise.all(
      l1Ids.map(id => this.getNetworkPerformance(id))
    );

    // Notify listeners of updates
    this.listeners.forEach(listener => listener(performances));
    return performances;
  }

  async getICMActivity(l1Id: string): Promise<ICMActivity> {
    // Simulate ICM message tracking
    return {
      l1Id,
      messagesPerHour: Math.floor(Math.random() * 500) + 50,
      avgMessageLatency: Math.random() * 2000 + 500, // 500-2500ms
      failureRate: Math.random() * 2, // 0-2% failure rate
      connectedL1s: this.getConnectedL1s(l1Id),
      lastMessage: new Date(Date.now() - Math.random() * 300000).toISOString()
    };
  }

  async getValidatorPerformance(l1Id: string): Promise<ValidatorPerformance[]> {
    // Simulate validator performance data
    const validatorCount = Math.floor(Math.random() * 15) + 5;
    return Array.from({ length: validatorCount }, (_, i) => ({
      nodeID: `NodeID-${this.generateRandomNodeId()}`,
      l1Id,
      uptime24h: 99 + Math.random() * 1,
      missedBlocks: Math.floor(Math.random() * 5),
      responseTime: Math.random() * 100 + 50,
      stakeAmount: `${(Math.random() * 3 + 1).toFixed(1)}K AVAX`,
      commission: Math.random() * 10,
      delegationCapacity: Math.random() * 100,
      isActive: Math.random() > 0.1, // 90% active
      lastSeen: new Date(Date.now() - Math.random() * 60000).toISOString()
    }));
  }

  // Real-time updates simulation
  startRealTimeUpdates(l1Ids: string[], interval = 5000) {
    return setInterval(async () => {
      try {
        await this.getAllNetworkPerformance(l1Ids);
      } catch (error) {
        console.error('Real-time update failed:', error);
      }
    }, interval);
  }

  stopRealTimeUpdates(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId);
  }

  subscribe(callback: (data: NetworkPerformance[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Helper methods
  private async getL1Name(l1Id: string): Promise<string> {
    // This would normally fetch from the L1 registry
    const names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK Crystalvale'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateRealisticTPS(l1Id: string, factor = 1): number {
    // Generate realistic TPS based on L1 type
    const hash = this.hashString(l1Id);
    const baseTPS = 20 + (hash % 80); // 20-100 base TPS
    const variation = (Math.sin(Date.now() / 60000) + 1) * 0.5; // Time-based variation
    return Math.round(baseTPS * factor * (0.7 + variation * 0.6));
  }

  private generateRealisticBlockTime(l1Id: string): number {
    const hash = this.hashString(l1Id);
    const baseTime = 1.5 + (hash % 100) / 100; // 1.5-2.5 seconds
    const variation = Math.random() * 0.5 - 0.25; // ±0.25s variation
    return Math.max(0.5, baseTime + variation);
  }

  private generateGasPrice(l1Id: string): string {
    const gwei = 20 + Math.random() * 80; // 20-100 Gwei
    return `${gwei.toFixed(1)} Gwei`;
  }

  private generateHistoricalData(existing?: any) {
    const now = Date.now();
    const points = 24; // 24 hours of data

    if (existing && existing.tps.length >= points) {
      // Add new data point and remove old one
      const newTPS = Math.random() * 100 + 20;
      const newBlockTime = Math.random() * 2 + 1;
      const newGasPrice = Math.random() * 80 + 20;

      return {
        tps: [...existing.tps.slice(1), { timestamp: new Date(now).toISOString(), value: newTPS }],
        blockTime: [...existing.blockTime.slice(1), { timestamp: new Date(now).toISOString(), value: newBlockTime }],
        gasPrice: [...existing.gasPrice.slice(1), { timestamp: new Date(now).toISOString(), value: newGasPrice }]
      };
    }

    // Generate initial historical data
    return {
      tps: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now - (points - i) * 3600000).toISOString(),
        value: Math.random() * 100 + 20
      })),
      blockTime: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now - (points - i) * 3600000).toISOString(),
        value: Math.random() * 2 + 1
      })),
      gasPrice: Array.from({ length: points }, (_, i) => ({
        timestamp: new Date(now - (points - i) * 3600000).toISOString(),
        value: Math.random() * 80 + 20
      }))
    };
  }

  private getConnectedL1s(l1Id: string): string[] {
    // Simulate connected L1s for ICM
    const allL1s = ['l1-1', 'l1-2', 'l1-3', 'l1-4', 'l1-5'];
    const connectionCount = Math.floor(Math.random() * 3) + 1;
    return allL1s.filter(id => id !== l1Id).slice(0, connectionCount);
  }

  private generateRandomNodeId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}

export const performanceApi = new PerformanceApiService();
export type { NetworkPerformance, ICMActivity, ValidatorPerformance };