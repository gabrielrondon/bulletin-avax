interface ICMMessage {
  id: string;
  sourceL1: string;
  destinationL1: string;
  messageType: 'transfer' | 'contract_call' | 'validation' | 'custom';
  status: 'pending' | 'delivered' | 'failed' | 'expired';
  timestamp: string;
  latency: number; // milliseconds
  payload: any;
  gasUsed: string;
  fees: string;
  blockHeight: {
    source: number;
    destination: number;
  };
}

interface ICMRoute {
  sourceL1: string;
  destinationL1: string;
  isActive: boolean;
  messagesLast24h: number;
  avgLatency: number;
  failureRate: number; // percentage
  totalVolume: string; // in AVAX
  lastMessage: string;
  routeHealth: 'excellent' | 'good' | 'degraded' | 'failing';
}

interface ICMNetworkStats {
  l1Id: string;
  l1Name: string;
  totalMessagesIn: number;
  totalMessagesOut: number;
  connectedL1s: number;
  messageVolume24h: number;
  avgIncomingLatency: number;
  avgOutgoingLatency: number;
  failureRate: number;
  icmCapabilities: {
    nativeMessaging: boolean;
    contractCalls: boolean;
    assetTransfers: boolean;
    customProtocols: boolean;
  };
  bridgeConnections: Array<{
    l1Id: string;
    l1Name: string;
    bridgeType: 'native' | 'warp' | 'teleporter' | 'custom';
    isActive: boolean;
  }>;
}

interface ICMAnalytics {
  totalMessages24h: number;
  totalRoutes: number;
  activeRoutes: number;
  avgCrossChainLatency: number;
  networkEfficiency: number; // percentage
  topRoutes: Array<{
    route: string;
    volume: number;
    latency: number;
  }>;
  messageTypeDistribution: {
    transfers: number;
    contractCalls: number;
    validations: number;
    custom: number;
  };
}

class ICMApiService {
  private readonly API_BASE = 'https://api.avax.network/ext/icm';
  private messageCache = new Map<string, ICMMessage[]>();
  private routeCache = new Map<string, ICMRoute[]>();
  private listeners = new Set<(type: string, data: any) => void>();

  async getICMMessages(l1Id?: string, limit = 50): Promise<ICMMessage[]> {
    try {
      // Simulate real ICM message data
      const messages = this.generateRecentMessages(limit, l1Id);

      if (l1Id) {
        this.messageCache.set(l1Id, messages);
      }

      return messages;
    } catch (error) {
      throw new Error(`Failed to fetch ICM messages: ${error}`);
    }
  }

  async getICMRoutes(): Promise<ICMRoute[]> {
    try {
      const routes = this.generateActiveRoutes();
      this.routeCache.set('all', routes);
      return routes;
    } catch (error) {
      throw new Error(`Failed to fetch ICM routes: ${error}`);
    }
  }

  async getNetworkICMStats(l1Id: string): Promise<ICMNetworkStats> {
    try {
      return this.generateNetworkStats(l1Id);
    } catch (error) {
      throw new Error(`Failed to fetch ICM stats for ${l1Id}: ${error}`);
    }
  }

  async getICMAnalytics(): Promise<ICMAnalytics> {
    try {
      const routes = await this.getICMRoutes();
      const messages = await this.getICMMessages();

      return {
        totalMessages24h: messages.length,
        totalRoutes: routes.length,
        activeRoutes: routes.filter(r => r.isActive).length,
        avgCrossChainLatency: routes.reduce((sum, r) => sum + r.avgLatency, 0) / routes.length,
        networkEfficiency: this.calculateNetworkEfficiency(routes),
        topRoutes: routes
          .sort((a, b) => b.messagesLast24h - a.messagesLast24h)
          .slice(0, 5)
          .map(r => ({
            route: `${r.sourceL1} → ${r.destinationL1}`,
            volume: r.messagesLast24h,
            latency: r.avgLatency
          })),
        messageTypeDistribution: this.calculateMessageDistribution(messages)
      };
    } catch (error) {
      throw new Error(`Failed to fetch ICM analytics: ${error}`);
    }
  }

  async getMessageFlow(timeframe = '24h'): Promise<Array<{
    from: string;
    to: string;
    count: number;
    volume: string;
    avgLatency: number;
  }>> {
    // Simulate message flow visualization data
    const l1Names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK'];
    const flows = [];

    for (let i = 0; i < l1Names.length; i++) {
      for (let j = 0; j < l1Names.length; j++) {
        if (i !== j && Math.random() > 0.3) { // 70% chance of connection
          const count = Math.floor(Math.random() * 500) + 50;
          flows.push({
            from: l1Names[i],
            to: l1Names[j],
            count,
            volume: `${(count * (Math.random() * 10 + 1)).toFixed(1)} AVAX`,
            avgLatency: Math.random() * 3000 + 500 // 500-3500ms
          });
        }
      }
    }

    return flows;
  }

  // Real-time ICM monitoring
  startICMMonitoring(interval = 10000) {
    return setInterval(async () => {
      try {
        const analytics = await this.getICMAnalytics();
        this.notifyListeners('analytics', analytics);

        const routes = await this.getICMRoutes();
        this.notifyListeners('routes', routes);

        const messages = await this.getICMMessages(undefined, 20);
        this.notifyListeners('messages', messages);
      } catch (error) {
        console.error('ICM monitoring failed:', error);
      }
    }, interval);
  }

  stopICMMonitoring(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId);
  }

  subscribeToICM(callback: (type: string, data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(type: string, data: any) {
    this.listeners.forEach(listener => listener(type, data));
  }

  // Helper methods for generating realistic data
  private generateRecentMessages(limit: number, l1Id?: string): ICMMessage[] {
    const messageTypes: ICMMessage['messageType'][] = ['transfer', 'contract_call', 'validation', 'custom'];
    const statuses: ICMMessage['status'][] = ['pending', 'delivered', 'failed', 'expired'];
    const l1Names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK', 'Amichain'];

    return Array.from({ length: limit }, (_, i) => {
      const timestamp = new Date(Date.now() - i * 30000).toISOString(); // Every 30 seconds
      const sourceL1 = l1Id || l1Names[Math.floor(Math.random() * l1Names.length)];
      const destinationL1 = l1Names.filter(name => name !== sourceL1)[Math.floor(Math.random() * (l1Names.length - 1))];
      const latency = Math.random() * 5000 + 500; // 500-5500ms

      return {
        id: `icm_${Date.now()}_${i}`,
        sourceL1,
        destinationL1,
        messageType: messageTypes[Math.floor(Math.random() * messageTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp,
        latency,
        payload: this.generateMessagePayload(),
        gasUsed: `${(Math.random() * 50000 + 10000).toFixed(0)}`,
        fees: `${(Math.random() * 0.1 + 0.001).toFixed(4)} AVAX`,
        blockHeight: {
          source: Math.floor(Math.random() * 1000000) + 500000,
          destination: Math.floor(Math.random() * 1000000) + 500000
        }
      };
    });
  }

  private generateActiveRoutes(): ICMRoute[] {
    const l1Names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK'];
    const routes = [];

    for (let i = 0; i < l1Names.length; i++) {
      for (let j = 0; j < l1Names.length; j++) {
        if (i !== j && Math.random() > 0.4) { // 60% chance of active route
          const messagesLast24h = Math.floor(Math.random() * 1000) + 50;
          const avgLatency = Math.random() * 3000 + 800;
          const failureRate = Math.random() * 5; // 0-5%

          routes.push({
            sourceL1: l1Names[i],
            destinationL1: l1Names[j],
            isActive: Math.random() > 0.1, // 90% active
            messagesLast24h,
            avgLatency,
            failureRate,
            totalVolume: `${(messagesLast24h * (Math.random() * 5 + 0.5)).toFixed(1)} AVAX`,
            lastMessage: new Date(Date.now() - Math.random() * 3600000).toISOString(),
            routeHealth: this.calculateRouteHealth(avgLatency, failureRate)
          });
        }
      }
    }

    return routes;
  }

  private generateNetworkStats(l1Id: string): ICMNetworkStats {
    const l1Names = ['GUNZ', 'Beam', 'Dexalot', 'Shrapnel', 'Merit Circle', 'DFK'];
    const l1Name = l1Names[Math.floor(Math.random() * l1Names.length)];
    const connectedL1s = l1Names.filter(name => name !== l1Name).slice(0, Math.floor(Math.random() * 4) + 2);

    return {
      l1Id,
      l1Name,
      totalMessagesIn: Math.floor(Math.random() * 5000) + 500,
      totalMessagesOut: Math.floor(Math.random() * 5000) + 500,
      connectedL1s: connectedL1s.length,
      messageVolume24h: Math.floor(Math.random() * 1000) + 100,
      avgIncomingLatency: Math.random() * 2000 + 800,
      avgOutgoingLatency: Math.random() * 2000 + 800,
      failureRate: Math.random() * 3, // 0-3%
      icmCapabilities: {
        nativeMessaging: true,
        contractCalls: Math.random() > 0.3,
        assetTransfers: Math.random() > 0.2,
        customProtocols: Math.random() > 0.5
      },
      bridgeConnections: connectedL1s.map(name => ({
        l1Id: `l1_${name}`,
        l1Name: name,
        bridgeType: this.getRandomBridgeType(),
        isActive: Math.random() > 0.1
      }))
    };
  }

  private generateMessagePayload() {
    const payloadTypes = [
      { type: 'token_transfer', amount: `${(Math.random() * 1000).toFixed(2)} AVAX` },
      { type: 'nft_transfer', tokenId: Math.floor(Math.random() * 10000) },
      { type: 'contract_call', method: 'stake', data: '0x...' },
      { type: 'governance', proposal: Math.floor(Math.random() * 100) }
    ];

    return payloadTypes[Math.floor(Math.random() * payloadTypes.length)];
  }

  private calculateRouteHealth(latency: number, failureRate: number): ICMRoute['routeHealth'] {
    if (latency < 1500 && failureRate < 1) return 'excellent';
    if (latency < 2500 && failureRate < 2) return 'good';
    if (latency < 4000 && failureRate < 4) return 'degraded';
    return 'failing';
  }

  private calculateNetworkEfficiency(routes: ICMRoute[]): number {
    const healthScores = routes.map(route => {
      switch (route.routeHealth) {
        case 'excellent': return 100;
        case 'good': return 80;
        case 'degraded': return 60;
        case 'failing': return 30;
        default: return 50;
      }
    });

    return healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;
  }

  private calculateMessageDistribution(messages: ICMMessage[]): ICMAnalytics['messageTypeDistribution'] {
    const distribution = { transfers: 0, contractCalls: 0, validations: 0, custom: 0 };

    messages.forEach(msg => {
      switch (msg.messageType) {
        case 'transfer': distribution.transfers++; break;
        case 'contract_call': distribution.contractCalls++; break;
        case 'validation': distribution.validations++; break;
        case 'custom': distribution.custom++; break;
      }
    });

    return distribution;
  }

  private getRandomBridgeType(): 'native' | 'warp' | 'teleporter' | 'custom' {
    const types: ('native' | 'warp' | 'teleporter' | 'custom')[] = ['native', 'warp', 'teleporter', 'custom'];
    return types[Math.floor(Math.random() * types.length)];
  }
}

export const icmApi = new ICMApiService();
export type { ICMMessage, ICMRoute, ICMNetworkStats, ICMAnalytics };