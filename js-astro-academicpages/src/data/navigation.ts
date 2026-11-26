/**
 * Top Navigation Bar Configuration
 *
 * Customize the links displayed in the primary header masthead.
 */

export interface NavItem {
  /** Navigation item label */
  title: string;
  /** Destination route or external URL */
  url: string;
}

export const navigation: NavItem[] = [
  { title: 'Publications', url: '/publications/' },
  { title: 'Talks', url: '/talks/' },
  { title: 'Teaching', url: '/teaching/' },
  { title: 'Portfolio', url: '/portfolio/' },
  { title: 'Blog Posts', url: '/posts/' },
  { title: 'CV', url: '/cv/' },
  { title: 'Guide', url: '/markdown/' },
];
