/**
 * Global site metadata and navigation.
 * Keeping this in one place avoids copy-pasted strings across layouts.
 * All values are template placeholders — edit them when you adopt the template.
 */
export const site = {
  name: 'Astro Wellness',
  tagline: 'Train hard. Recover smart.',
  description:
    'Astro Wellness is a modern gym for strength, conditioning, and recovery. Group classes, personal training, and nutrition coaching under one roof.',
  // All contact details are placeholders — replace before going live.
  email: 'hello@example.com',
  phone: '+1 (555) 010-2030',
  address: '123 Example Street · Example City, EX',
  // Used by the sitemap and canonical URLs. Keep in sync with astro.config.mjs.
  url: 'https://example.com',
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];
