import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Docusaurus on Wasmer Edge',
  tagline: 'Documentation and a blog, served as static files',
  favicon: 'img/favicon.ico',
  url: process.env.SITE_URL || 'https://example.com',
  baseUrl: '/',
  organizationName: 'wasmerio',
  projectName: 'examples',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'en', locales: ['en']},
  presets: [['classic', {
    docs: {sidebarPath: './sidebars.ts'},
    blog: {showReadingTime: true, feedOptions: {type: ['rss', 'atom'], xslt: true}},
    theme: {customCss: './src/css/custom.css'},
  } satisfies Preset.Options]],
  themeConfig: {
    colorMode: {defaultMode: 'light', disableSwitch: true, respectPrefersColorScheme: false},
    navbar: {title: 'Wasmer Docs Starter', items: [
      {type: 'docSidebar', sidebarId: 'tutorialSidebar', position: 'left', label: 'Docs'},
      {to: '/blog', label: 'Blog', position: 'left'},
      {href: 'https://github.com/wasmerio/examples', label: 'GitHub', position: 'right'},
    ]},
    footer: {links: [{title: 'Explore', items: [
      {label: 'Docs', to: '/docs/intro'}, {label: 'Blog', to: '/blog'},
      {label: 'Wasmer Edge', href: 'https://docs.wasmer.io/edge'},
    ]}], copyright: 'Built with Docusaurus. Hosted on Wasmer Edge.'},
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  } satisfies Preset.ThemeConfig,
};
export default config;
