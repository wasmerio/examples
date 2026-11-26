import type { Link, NavigationItem } from '../types';

/**
 * Header navigation. Homepage sections use "/#id" so the links work from every page.
 * Items with `matchPath` get aria-current when the visitor is on that page.
 */
export const mainNav: NavigationItem[] = [
  { label: 'Solutions', href: '/#services' },
  { label: 'Features', href: '/#platform' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Customers', href: '/#work' },
  { label: 'Insights', href: '/blog', matchPath: '/blog' },
];

/** Mobile menu adds a direct Contact link below the main items. */
export const mobileNav: NavigationItem[] = [...mainNav, { label: 'Contact', href: '/#contact' }];

export interface FooterColumn {
  title: string;
  links: Link[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Customer support', href: '/#services' },
      { label: 'Back office', href: '/#services' },
      { label: 'Documents & claims', href: '/#services' },
      { label: 'Revenue research', href: '/#services' },
      { label: 'Evaluation', href: '/#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/#team' },
      { label: 'Customers', href: '/#work' },
      { label: 'How we work', href: '/#process' },
      { label: 'Insights', href: '/blog' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Sectors',
    links: [
      { label: 'Banking & fintech', href: '/#sectors' },
      { label: 'Healthcare', href: '/#sectors' },
      { label: 'Logistics', href: '/#sectors' },
      { label: 'Insurance', href: '/#sectors' },
      { label: 'Commerce', href: '/#sectors' },
    ],
  },
];

/**
 * Links in the bottom bar of the footer. The theme ships without legal pages,
 * so only real routes are listed. Add your own once the pages exist, e.g.
 *   { label: 'Privacy', href: '/privacy' },
 *   { label: 'Terms', href: '/terms' },
 */
export const legalLinks: Link[] = [
  { label: 'RSS', href: '/rss.xml' },
  { label: 'Sitemap', href: '/sitemap-index.xml' },
];
