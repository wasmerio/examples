// Brand + navigation. Text values live in site-settings.json (editable in /keystatic).
import settings from './site-settings.json';

export const site = {
  ...settings,
  url: 'https://runlog.example.com',
  secondary: { label: 'See the Pro demo', href: 'https://runlog-astro.pages.dev' },
  pro: 'https://runlog-astro.pages.dev',
  nav: [
    { label: 'Product', href: '/#how' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pro version', href: 'https://runlog-astro.pages.dev' },
  ],
  menu: [
    { label: 'Product', href: '/#how' },
    { label: 'Blog', href: '/blog' },
    { label: 'Get Runlog Pro', href: 'https://contra.com/products/QETiOjxd-runlog-pro-ai-agent-and-dev-tool-saa-s-astro-theme' },
  ],
  footer: [
    { title: 'Theme', links: [['Home', '/'], ['Blog', '/blog'], ['Runlog Pro', 'https://runlog-astro.pages.dev']] },
    { title: 'Pro adds', links: [['Pricing page', 'https://runlog-astro.pages.dev/pricing'], ['Docs', 'https://runlog-astro.pages.dev/docs/quickstart'], ['Changelog', 'https://runlog-astro.pages.dev/changelog'], ['Contact + Thank you', 'https://runlog-astro.pages.dev/contact']] },
    { title: 'Also in Pro', links: [['Keystatic CMS', 'https://runlog-astro.pages.dev'], ['Figma file', 'https://runlog-astro.pages.dev']] },
    { title: 'Made by', links: [['Pavlo Zhydkykh', 'https://pzhydkykh.com']] },
  ],
} as const;
