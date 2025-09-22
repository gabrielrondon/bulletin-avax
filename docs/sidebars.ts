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
        'avalanche/l1-networks',
        'avalanche/icm',
        'avalanche/validators',
      ],
    },
  ],

  // Platform sidebar for Bulletin AVAX
  platformSidebar: [
    'platform/getting-started',
    {
      type: 'category',
      label: '🔍 Platform Features',
      items: [
        'platform/l1-explorer',
        'platform/analytics',
      ],
    },
  ],
};

export default sidebars;
