import type { FooterColumn, NavigationItem } from '../types';
import { classes } from './classes';

/**
 * Primary navigation. Home-page sections use `/#anchor` links so they also
 * work from inner pages such as /contact or /blog.
 */
export const primaryNav: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Classes', href: '/#classes' },
  { label: 'Schedule', href: '/#schedule' },
  { label: 'Coaches', href: '/#coaches' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Retreats', href: '/#retreats' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/** Buttons on the right side of the header. Remove an entry to hide it. */
export const headerActions = {
  schedule: { label: 'Schedule', ariaLabel: 'View class schedule', href: '/#schedule' },
  memberships: { ariaLabel: 'Memberships and class passes', href: '/#pricing' },
};

export const footerColumns: FooterColumn[] = [
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/#approach' },
      { label: 'Coaches', href: '/#coaches' },
      { label: 'Pricing', href: '/#pricing' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Classes',
    links: classes.slice(0, 5).map((item) => ({ label: item.title, href: '/#classes' })),
  },
];

/** Optional legal links. Only add pages that exist (e.g. /privacy). */
export const legalNav: NavigationItem[] = [];
