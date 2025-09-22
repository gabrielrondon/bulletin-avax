import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Bulletin AVAX Docs',
  tagline: 'Master Avalanche L1s & Professional Analytics',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://bulletin-avax-docs.vercel.app',
  baseUrl: '/',

  organizationName: 'gabrielrondon',
  projectName: 'bulletin-avax-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/gabrielrondon/bulletin-avax/tree/main/docs/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/gabrielrondon/bulletin-avax/tree/main/docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/bulletin-avax-social.jpg',
    navbar: {
      title: 'Bulletin AVAX',
      logo: {
        alt: 'Bulletin AVAX Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Learn Avalanche',
        },
        {
          type: 'docSidebar',
          sidebarId: 'platformSidebar',
          position: 'left',
          label: 'Platform Guide',
        },
        {to: '/blog', label: 'Updates', position: 'left'},
        {
          href: 'https://bulletin-avax.vercel.app',
          label: 'Open Platform',
          position: 'right',
          className: 'header-platform-link',
        },
        {
          href: 'https://github.com/gabrielrondon/bulletin-avax',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Learn',
          items: [
            {
              label: 'Avalanche Fundamentals',
              to: '/docs/avalanche/introduction',
            },
            {
              label: 'L1 Networks Guide',
              to: '/docs/avalanche/l1-networks',
            },
            {
              label: 'ICM & Cross-Chain',
              to: '/docs/avalanche/icm',
            },
          ],
        },
        {
          title: 'Platform',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/platform/getting-started',
            },
            {
              label: 'Analytics Dashboard',
              to: '/docs/platform/analytics',
            },
            {
              label: 'Validator Intelligence',
              to: '/docs/platform/validators',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Open Platform',
              href: 'https://bulletin-avax.vercel.app',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/gabrielrondon/bulletin-avax',
            },
            {
              label: 'Avalanche Official',
              href: 'https://avax.network',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Bulletin AVAX. Professional Avalanche Ecosystem Analytics.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['solidity', 'javascript', 'typescript'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;