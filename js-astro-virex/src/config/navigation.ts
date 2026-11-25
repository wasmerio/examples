/**
 * Navigation Configuration
 *
 * @description
 * Centralized navigation configuration for header and footer.
 * All navigation items are defined here for consistency and easy maintenance.
 *
 * Items with a `feature` property will only be shown if that feature is enabled
 * in the site config's feature flags.
 */

import type { Navigation } from '../lib/types';

export const navigation: Navigation = {
  /**
   * Header Navigation
   * - main: Primary navigation links
   * - cta: Call-to-action buttons on the right
   */
  header: {
    main: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Demo', href: '/dashboard' },
      { label: 'Customers', href: '/customers' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Docs', href: '/docs', feature: 'docs' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    cta: [
      { label: 'Login', href: '/login', variant: 'ghost' },
      { label: 'Get Started', href: '/register', variant: 'primary' },
    ],
  },

  /**
   * Footer Navigation
   * Organized into 5 columns: Product, Solutions, Resources, Company, Legal
   */
  footer: {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Security', href: '/security' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
    ],
    solutions: [
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Customers', href: '/customers' },
      { label: 'Request Demo', href: '/demo' },
      { label: 'Status', href: '/status' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs', feature: 'docs' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
      { label: 'Changelog', href: '/changelog', feature: 'changelog' },
      { label: 'Roadmap', href: '/roadmap', feature: 'roadmap' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      { label: 'Testimonials', href: '/testimonials', feature: 'testimonials' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
};
