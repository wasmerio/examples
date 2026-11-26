// Site-wide identity. Edit these values first — the header, footer, contact
// card, SEO tags and JSON-LD all read from here.
export const site = {
  name: 'Your Name',
  role: 'Product designer & developer',
  // Your live domain. Also set `site` in astro.config.mjs (or PUBLIC_SITE_URL) for the sitemap.
  url: 'https://example.com',
  contactEmail: 'hello@example.com',
  tagline: 'Product designer who ships.',
  description: 'Portfolio of Your Name: product design, front-end development and selected projects.',
  // Shown under your name in the footer — availability, location, or anything short.
  status: 'Open to new roles · Your City',
  ogImage: '/assets/brand/og-image.png',
  linkedin: 'https://www.linkedin.com/in/your-handle',
  github: 'https://github.com/your-handle',
  gitlab: 'https://gitlab.com/your-handle',
  locale: 'en-US',
} as const;

// Round social buttons in the footer. Remove any you don't use; icons live in
// public/icons/social/ and take the current text colour.
export const socialLinks = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/your-handle', icon: '/icons/social/linkedin.svg' },
  { name: 'Instagram', href: 'https://www.instagram.com/your-handle', icon: '/icons/social/instagram.svg' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@your-handle', icon: '/icons/social/tiktok.svg' },
  { name: 'Facebook', href: 'https://www.facebook.com/your-handle', icon: '/icons/social/facebook.svg' },
  { name: 'Reddit', href: 'https://www.reddit.com/user/your-handle', icon: '/icons/social/reddit.svg' },
  { name: 'Snapchat', href: 'https://www.snapchat.com/add/your-handle', icon: '/icons/social/snapchat.svg' },
  { name: 'WhatsApp', href: 'https://wa.me/0000000000', icon: '/icons/social/whatsapp.svg' },
] as const;
