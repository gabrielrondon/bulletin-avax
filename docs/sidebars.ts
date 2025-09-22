import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Tutorial sidebar for Avalanche education
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: '🏔️ Avalanche Fundamentals',
      items: [
        'avalanche/introduction',
        'avalanche/consensus',
        'avalanche/network-architecture',
        'avalanche/avax-token',
      ],
    },
    {
      type: 'category',
      label: '🌐 Layer 1 Networks (L1s)',
      items: [
        'avalanche/l1-networks',
        'avalanche/subnet-vs-l1',
        'avalanche/vm-types',
        'avalanche/l1-lifecycle',
        'avalanche/popular-l1s',
      ],
    },
    {
      type: 'category',
      label: '🔗 Interchain Communication (ICM)',
      items: [
        'avalanche/icm',
        'avalanche/cross-chain-messaging',
        'avalanche/warp-messaging',
        'avalanche/icm-use-cases',
      ],
    },
    {
      type: 'category',
      label: '⚡ Validators & Staking',
      items: [
        'avalanche/validators',
        'avalanche/staking-mechanics',
        'avalanche/delegation',
        'avalanche/validator-requirements',
      ],
    },
    {
      type: 'category',
      label: '📊 Network Performance',
      items: [
        'avalanche/performance-metrics',
        'avalanche/tps-and-finality',
        'avalanche/gas-and-fees',
        'avalanche/network-health',
      ],
    },
    {
      type: 'category',
      label: '🛠️ Developer Resources',
      items: [
        'avalanche/development-stack',
        'avalanche/apis-and-rpcs',
        'avalanche/explorer-tools',
        'avalanche/debugging',
      ],
    },
  ],

  // Platform sidebar for Bulletin AVAX
  platformSidebar: [
    'platform/getting-started',
    {
      type: 'category',
      label: '🔍 L1 Explorer',
      items: [
        'platform/l1-explorer',
        'platform/network-details',
        'platform/validator-info',
        'platform/explorer-links',
      ],
    },
    {
      type: 'category',
      label: '📈 Performance Dashboard',
      items: [
        'platform/analytics',
        'platform/real-time-metrics',
        'platform/network-comparison',
        'platform/performance-ranking',
      ],
    },
    {
      type: 'category',
      label: '🌐 ICM Hub',
      items: [
        'platform/icm-hub',
        'platform/message-tracking',
        'platform/route-analysis',
        'platform/cross-chain-analytics',
      ],
    },
    {
      type: 'category',
      label: '⚡ Validator Intelligence',
      items: [
        'platform/validators',
        'platform/staking-calculator',
        'platform/delegation-strategies',
        'platform/validator-rankings',
      ],
    },
    {
      type: 'category',
      label: '📊 Advanced Features',
      items: [
        'platform/data-sources',
        'platform/api-integration',
        'platform/export-data',
        'platform/custom-alerts',
      ],
    },
  ],
};

export default sidebars;
