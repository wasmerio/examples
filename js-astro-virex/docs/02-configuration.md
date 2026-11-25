# Configuration

All configuration is centralized in `src/config/`. Import from `@/config` to access settings.

## Configuration Files

All configuration files are located in `src/config/`:

| File | Purpose |
|------|---------|
| `site.ts` | Site metadata, logo, social links |
| `contact.ts` | Contact information and methods |
| `navigation.ts` | Header and footer navigation |
| `dashboard-navigation.ts` | Dashboard sidebar navigation |
| `features.ts` | Feature flags to enable/disable sections |
| `content.ts` | Announcement bar and newsletter text |
| `index.ts` | Main export (imports all configs) |

## Site Configuration

The easiest way to configure your site is via environment variables. Copy `.env.example` to `.env` and set:

```bash
SITE_URL=https://your-domain.com
SITE_NAME=Your Brand
SITE_DESCRIPTION=Your product description here
SITE_AUTHOR=Your Name
```

These values are used throughout the site for SEO, meta tags, sitemap, and RSS feeds.

For additional customization (logo, social links, etc.), edit `src/config/site.ts`:

```typescript
// Logo path (relative to /public), set to "" to show site name instead
export const logo = '/logo.svg';

// Open Graph image path
export const ogImage = '/images/og-image.png';

// Social media links
export const social = {
  twitter: 'https://twitter.com/yourhandle',
  github: 'https://github.com/yourrepo',
  discord: 'https://discord.gg/yourinvite',
};
```

## Contact Information

Configure contact details in `src/config/contact.ts`:

```typescript
export const contact = {
  email: 'hello@yoursite.com',
  supportEmail: 'support@yoursite.com',
  salesEmail: 'sales@yoursite.com',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'United States',
  },
};

// Contact methods displayed on the contact page
export const contactMethods = [
  {
    icon: 'lucide:mail',
    label: 'Email',
    value: 'hello@yoursite.com',
    href: 'mailto:hello@yoursite.com',
  },
  {
    icon: 'simple-icons:discord',
    label: 'Discord',
    value: 'Join Discord',
    href: 'https://discord.gg/yourserver',
  },
  // Add more contact methods...
];

// FAQ items displayed on the contact page
export const contactFAQs = [
  {
    question: "What's your typical response time?",
    answer: 'We respond within 24 hours during business days.',
  },
  // Add more FAQs...
];
```

## Legal Configuration

For privacy policy and terms pages:

```typescript
export const legal = {
  privacyEmail: 'privacy@yoursite.com',
  legalEmail: 'legal@yoursite.com',
  lastUpdated: 'January 1, 2025',
};
```

## Navigation

Navigation is centralized in `src/config/navigation.ts` with separate configurations for header and footer.

### Header Navigation

```typescript
export const navigation = {
  header: {
    // Main navigation links (center)
    main: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Customers', href: '/customers' },
      { label: 'Enterprise', href: '/enterprise' },
      { label: 'Docs', href: '/docs', feature: 'docs' },
      { label: 'Blog', href: '/blog', feature: 'blog' },
    ],
    // CTA buttons (right side)
    cta: [
      { label: 'Login', href: '/login', variant: 'ghost' },
      { label: 'Get Started', href: '/register', variant: 'primary' },
    ],
  },
  // ... footer config
};
```

### Footer Navigation

The footer is organized into 5 columns:

```typescript
export const navigation = {
  // ... header config
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
```

### Feature-Flagged Navigation

Items with a `feature` property are automatically hidden when that feature is disabled:

```typescript
{ label: 'Blog', href: '/blog', feature: 'blog' }
// Only shows if features.blog is true
```

### CTA Variants

Header CTA buttons support three variants:

| Variant | Style |
|---------|-------|
| `ghost` | Text link style |
| `primary` | Solid primary button |
| `secondary` | Outlined button |

## Dashboard Navigation

Dashboard sidebar navigation is configured in `src/config/dashboard-navigation.ts`:

```typescript
export const dashboardNavigation: DashboardNavSection[] = [
  {
    // Section without header
    items: [
      {
        label: 'Overview',
        href: '/dashboard',
        icon: 'layout-dashboard',
      },
    ],
  },
  {
    // Section with header
    title: 'Management',
    items: [
      {
        label: 'Projects',
        href: '/dashboard/projects',
        icon: 'folder',
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings',
        // Nested items
        children: [
          {
            label: 'Profile',
            href: '/dashboard/settings/profile',
            icon: 'user',
          },
          {
            label: 'Team',
            href: '/dashboard/settings/team',
            icon: 'users',
          },
          {
            label: 'Billing',
            href: '/dashboard/settings/billing',
            icon: 'credit-card',
          },
        ],
      },
    ],
  },
];
```

**Features:**
- Supports nested navigation (up to 2 levels)
- Section headers for grouping
- Lucide icons for all items
- Active state highlighting

See [Dashboard documentation](./07-dashboard.md#navigation) for more details.

## Feature Flags

Toggle features in `src/config/features.ts`:

```typescript
export const features = {
  blog: true,        // /blog routes
  docs: true,        // /docs routes
  changelog: true,   // /changelog page
  testimonials: true,// /testimonials page
  roadmap: true,     // /roadmap page
};
```

Feature flags control:
- **Navigation**: Disabled features are hidden from header and footer
- **Sitemap**: Disabled features are excluded from `sitemap.xml`
- **RSS**: Only enabled blog posts appear in the feed
- **Pages**: Pages remain accessible via direct URL (not deleted)

## Announcement Bar

Configure in `src/config/content.ts`:

```typescript
export const announcement = {
  enabled: true,
  id: 'launch-2025',        // Change ID to reset dismissal
  text: '🚀 Version 2.0 is here!',
  href: '/changelog',       // Optional link
  linkText: "See what's new",
  variant: 'primary',       // 'primary' | 'secondary' | 'gradient'
  dismissible: true,        // Allow users to close
};
```

When users dismiss the banner, their preference is saved in localStorage. Change the `id` to show a new announcement.

## Newsletter Strings

Customize newsletter section text in `src/config/content.ts`:

```typescript
export const content = {
  newsletter: {
    title: 'Stay in the loop',
    description: 'Get the latest updates delivered to your inbox.',
    placeholder: 'Enter your email',
    buttonText: 'Subscribe',
    successMessage: 'Thanks for subscribing!',
    errorMessage: 'Something went wrong. Please try again.',
    privacyNote: 'We respect your privacy. Unsubscribe at any time.',
  },
};
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Required: Site identity
SITE_URL=https://your-domain.com
SITE_NAME=Your Brand
SITE_DESCRIPTION=Your product description here
SITE_AUTHOR=Your Name

# Optional: Authentication (if using dashboard)
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
# Or custom API
AUTH_API_URL=https://api.yoursite.com
AUTH_API_KEY=your-api-key

# Optional: Analytics
PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Site Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_URL` | Yes | Canonical URL for SEO, sitemap, and RSS |
| `SITE_NAME` | Yes | Site/brand name for header, footer, and meta tags |
| `SITE_DESCRIPTION` | Yes | Site description for SEO meta tags |
| `SITE_AUTHOR` | Yes | Author name for meta tags and copyright |

### Authentication Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | No | Supabase project URL (if using Supabase auth) |
| `SUPABASE_ANON_KEY` | No | Supabase anonymous key |
| `AUTH_API_URL` | No | Custom authentication API endpoint |
| `AUTH_API_KEY` | No | API key for custom auth service |

See [Authentication documentation](./08-authentication.md#environment-variables-for-auth) for auth setup details.

### Analytics Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PUBLIC_GA_ID` | No | Google Analytics measurement ID |

## Astro Configuration

The `astro.config.mjs` includes:
- MDX support for rich content
- Icon support via `astro-icon` (Lucide + Simple Icons)
- Sitemap generation with feature flag filtering
- Tailwind CSS v4 via Vite plugin

The `site` property automatically reads from `SITE_URL` environment variable:

```javascript
const siteUrl = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site: siteUrl,
  // ...
});
```

No need to edit `astro.config.mjs` directly — just set `SITE_URL` in your `.env` file.

## RSS Feed

The RSS feed is automatically generated at `/rss.xml` for blog posts. The feed respects the `draft` field - draft posts are excluded.

To customize the feed, edit `src/pages/rss.xml.ts`.

## Internationalization (i18n)

The theme currently uses `en-US` locale. To change the language:

1. Update the `lang` attribute in `src/layouts/BaseLayout.astro`:
   ```html
   <html lang="id">  <!-- Change to your locale -->
   ```

2. Update date formatting in `src/lib/utils.ts`:
   ```typescript
   return new Intl.DateTimeFormat('id-ID', options).format(date);
   ```
