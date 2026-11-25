# Pages

All pages are in `src/pages/`. Astro uses file-based routing.

## Available Pages

### Marketing Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.astro` | Landing page with hero, features, testimonials |
| `/features` | `features.astro` | Product features showcase |
| `/pricing` | `pricing.astro` | Pricing plans |
| `/about` | `about.astro` | About the company/team |
| `/contact` | `contact.astro` | Contact form and info |
| `/customers` | `customers.astro` | Customer stories and case studies |
| `/demo` | `demo.astro` | Request a demo form |
| `/enterprise` | `enterprise.astro` | Enterprise solutions landing page |
| `/integrations` | `integrations.astro` | Integrations showcase |
| `/security` | `security.astro` | Security and compliance info |

### Content Pages

| Route | File | Description |
|-------|------|-------------|
| `/blog` | `blog/index.astro` | Blog listing with pagination |
| `/blog/[slug]` | `blog/[...slug].astro` | Individual blog posts |
| `/blog/page/[page]` | `blog/page/[page].astro` | Blog pagination |
| `/blog/tag/[tag]` | `blog/tag/[tag].astro` | Posts filtered by tag |
| `/docs` | `docs/index.astro` | Documentation index |
| `/docs/[slug]` | `docs/[...slug].astro` | Documentation pages |
| `/changelog` | `changelog.astro` | Version history |
| `/testimonials` | `testimonials.astro` | Customer testimonials |
| `/roadmap` | `roadmap.astro` | Product roadmap |

### Legal Pages

| Route | File | Description |
|-------|------|-------------|
| `/privacy` | `privacy.astro` | Privacy policy |
| `/terms` | `terms.astro` | Terms of service |

### Other Pages

| Route | File | Description |
|-------|------|-------------|
| `/careers` | `careers.astro` | Careers/jobs page |
| `/faq` | `faq.astro` | Frequently asked questions |
| `/status` | `status.astro` | Service status page |

### Authentication Pages

| Route | File | Description |
|-------|------|-------------|
| `/login` | `login.astro` | User login |
| `/register` | `register.astro` | User registration |
| `/forgot-password` | `forgot-password.astro` | Password reset |

### Dashboard Pages

| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `dashboard/index.astro` | Dashboard overview with metrics and charts |
| `/dashboard/settings/profile` | `dashboard/settings/profile.astro` | User profile settings |
| `/dashboard/settings/team` | `dashboard/settings/team.astro` | Team management |
| `/dashboard/settings/billing` | `dashboard/settings/billing.astro` | Billing information |
| `/dashboard/projects` | `dashboard/projects/index.astro` | Projects list |
| `/dashboard/projects/[id]` | `dashboard/projects/[id].astro` | Project detail/edit |
| `/dashboard/components-demo` | `dashboard/components-demo.astro` | Dashboard components showcase |

**Note**: Dashboard pages use sample data and require authentication implementation. See [Dashboard documentation](./07-dashboard.md) for details.

### Error Pages

| Route | File | Description |
|-------|------|-------------|
| `/404` | `404.astro` | Not found (auto-handled by Astro) |
| `/403` | `403.astro` | Forbidden |
| `/500` | `500.astro` | Server error |

Error pages use `ErrorLayout` which provides a minimal design without header/footer.

### Generated Files

| Route | File | Description |
|-------|------|-------------|
| `/sitemap.xml` | (auto-generated) | XML sitemap |
| `/rss.xml` | `rss.xml.ts` | RSS feed for blog |
| `/robots.txt` | `robots.txt.ts` | Robots.txt |

## Adding New Pages

Create a new `.astro` file in `src/pages/`:

```astro
---
// src/pages/new-page.astro
import MarketingLayout from '@/layouts/MarketingLayout.astro';
import PageHeader from '@sections/content/PageHeader.astro';
import { siteConfig } from '@/config';
---

<MarketingLayout
  title={`New Page - ${siteConfig.name}`}
  description="Description for SEO"
>
  <PageHeader
    title="New Page"
    subtitle="Optional subtitle text"
  />

  <section class="py-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Your content -->
    </div>
  </section>
</MarketingLayout>
```

## Layouts

Choose the appropriate layout for your page:

| Layout | Use For |
|--------|---------|
| `MarketingLayout` | Marketing pages (includes header + footer) |
| `BlogLayout` | Blog posts (includes metadata, reading time) |
| `DocsLayout` | Documentation (includes sidebar) |
| `ErrorLayout` | Error pages (minimal, no header/footer) |
| `BaseLayout` | Custom pages (HTML shell only) |
| `DashboardLayout` | Dashboard pages (includes sidebar) |

## Removing Pages

1. Delete the page file from `src/pages/`
2. Remove any navigation links in `src/config/navigation.ts`
3. Update feature flags if applicable in `src/config/features.ts`

## Dynamic Routes

### Blog Post

`src/pages/blog/[...slug].astro` handles individual posts:

```astro
---
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
---
```

### Documentation

`src/pages/docs/[...slug].astro` works similarly for docs pages.

## Feature Flag Integration

Pages controlled by feature flags remain accessible via direct URL but are hidden from:
- Navigation menus
- Sitemap
- Internal links

To fully disable a section, you can delete the page files or add redirect rules.

## Page Categories

### SaaS Marketing Pages

These pages are designed for SaaS product marketing:

- **`/features`** - Detailed feature showcase with `FeatureHighlight` and `BentoGrid`
- **`/pricing`** - Pricing table with comparison and trust badges
- **`/customers`** - Customer stories using `CaseStudyCard` component
- **`/enterprise`** - Enterprise-focused landing with security badges and SSO info
- **`/integrations`** - Integration showcase using `IntegrationsGrid`
- **`/security`** - Security certifications using `SecurityBadges`
- **`/demo`** - Demo request form using `DemoRequestForm`

### Content Pages

These pages display content from collections:

- **`/blog`** - Blog posts from `src/content/blog/`
- **`/docs`** - Documentation from `src/content/docs/`
- **`/changelog`** - Releases from `src/content/changelog/`
- **`/testimonials`** - Quotes from `src/content/testimonials/`

### Utility Pages

- **`/faq`** - FAQ accordion using `FAQSection`
- **`/status`** - Service status using `StatusOverview`
- **`/roadmap`** - Product roadmap using `RoadmapTimeline`
- **`/careers`** - Job listings using `JobListings`

## Customizing Pages

Each page is a standalone Astro file that composes section components. To customize:

1. Open the page file in `src/pages/`
2. Modify the data passed to components
3. Add, remove, or reorder section components
4. Adjust the `background` prop for visual variety

Example - customizing the homepage:

```astro
---
import MarketingLayout from '@/layouts/MarketingLayout.astro';
import Hero from '@sections/marketing/Hero.astro';
import FeaturesSection from '@sections/marketing/FeaturesSection.astro';
import CTA from '@sections/marketing/CTA.astro';
---

<MarketingLayout title="Home">
  <Hero
    title="Your Custom Headline"
    subtitle="Your custom subtitle"
    primaryCTA={{ label: "Get Started", href: "/register" }}
  />

  <FeaturesSection
    title="Why Choose Us"
    features={[/* your features */]}
    background="muted"
  />

  <CTA
    title="Ready to start?"
    action={{ label: "Sign Up Free", href: "/register" }}
  />
</MarketingLayout>
```
