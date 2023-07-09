// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

async function createConfig() {
  /** @type {import('@docusaurus/types').Config} */
  return {
    title: 'mdx-mermaid',
    tagline: 'Plug and play Mermaid in MDX',
    url: 'https://sjwall.github.io',
    baseUrl: '/mdx-mermaid/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    trailingSlash: true,
    organizationName: 'sjwall', // Usually your GitHub org/user name.
    projectName: 'mdx-mermaid', // Usually your repo name.
    markdown: {
      mermaid: true,
    },
    themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/sjwall/mdx-mermaid/edit/main/doc',
          lastVersion: 'current',
          versions: {
            current: {
              label: '2.0.0',
            },
            '1.3.0': {
              label: '>= 1.3.0',
            },
            '1.2.3': {
              label: '<= 1.2.3',
            },
          },
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: 'mdx-mermaid',
          logo: {
            alt: 'mdx-mermaid',
            src: 'img/logo.svg',
          },
          items: [
            {
              type: 'doc',
              docId: 'intro',
              position: 'left',
              label: 'Tutorial',
            },
            {
              type: 'docsVersionDropdown',
              position: 'right',
              dropdownActiveClassDisabled: true,
            },
            {
              href: 'https://github.com/sjwall/mdx-mermaid',
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
                  label: 'Tutorial',
                  to: '/docs/intro',
                },
              ],
            },
            {
              title: 'Community',
              items: [
                {
                  label: 'Stack Overflow',
                  href: 'https://stackoverflow.com/questions/tagged/mdx-mermaid',
                },
              ],
            },
            {
              title: 'More',
              items: [
                {
                  label: 'GitHub',
                  href: 'https://github.com/sjwall/mdx-mermaid',
                },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Samuel Wall. Built with Docusaurus.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
        },
      }),
  };
}

module.exports = createConfig;
