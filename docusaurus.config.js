/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: '@react-facet',
  tagline: 'Observable-based state management for performant game UIs built in React',

  url: 'https://glowing-pancake-951ea524.pages.github.io/',
  baseUrl: '/',
  projectName: 'ore-ui',
  organizationName: 'Mojang',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/proto-logo2.png',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      style: 'primary',
      title: '@react-facet',
      logo: {
        alt: '@react-facet Logo',
        src: 'img/proto-logo2.png',
      },
      items: [
        {
          type: 'doc',
          docId: 'getting-started',
          position: 'left',
          label: 'Getting started',
        },
        {
          type: 'doc',
          docId: 'rendering/overview',
          position: 'left',
          label: 'Rendering',
        },
        {
          type: 'doc',
          docId: 'api/overview',
          position: 'left',
          label: 'API',
        },
        {
          href: 'https://github.com/mojang/react-facet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Goals',
              to: '/docs/goals',
            },
            {
              label: 'Getting started',
              to: '/docs/getting-started',
            },
            {
              label: 'Rendering',
              to: '/docs/rendering/overview',
            },
            {
              label: 'API',
              to: '/docs/api/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              to: 'https://github.com/mojang/ore-ui',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Mojang AB. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/mojang/ore-ui/edit/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/mojang/ore-ui/edit/main/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
