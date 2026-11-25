# Components

All components include JSDoc documentation with usage examples. Check the source files for detailed prop documentation.

## Icon System

The theme uses [astro-icon](https://github.com/natemoo-re/astro-icon) with [Iconify](https://iconify.design/) for icons. This provides access to 200,000+ icons from 100+ icon sets.

### Installed Icon Sets

- **Lucide** (`lucide:*`) - Clean, consistent icons for UI (primary)
- **Simple Icons** (`simple-icons:*`) - Brand logos (Discord, etc.)

### Usage

```astro
---
import { Icon } from 'astro-icon/components';
---

<!-- Basic usage -->
<Icon name="lucide:zap" />

<!-- With custom size -->
<Icon name="lucide:github" class="w-8 h-8" />

<!-- With custom styling -->
<Icon name="lucide:shield" class="w-6 h-6 text-primary" />

<!-- Brand icons -->
<Icon name="simple-icons:discord" class="w-5 h-5" />
```

### Common Icons Used

| Icon | Name | Usage |
|------|------|-------|
| Zap | `lucide:zap` | Features, speed |
| Shield | `lucide:shield` | Security |
| Globe | `lucide:globe` | Global, web |
| Chart | `lucide:bar-chart` | Analytics |
| Users | `lucide:users` | Team, users |
| Mail | `lucide:mail` | Email |
| Check | `lucide:check` | Checkmarks |
| Sun | `lucide:sun` | Light mode |
| Moon | `lucide:moon` | Dark mode |

### Adding More Icon Sets

Install additional Iconify icon packs:

```bash
npm install @iconify-json/heroicons
npm install @iconify-json/tabler
npm install @iconify-json/mdi
```

Then use them with their prefix:

```astro
<Icon name="heroicons:home" />
<Icon name="tabler:settings" />
<Icon name="mdi:account" />
```

### Browse Icons

- [Lucide Icons](https://lucide.dev/icons/) - Browse all Lucide icons
- [Iconify](https://icon-sets.iconify.design/) - Search all available icon sets

## Layout Components

### Header

`src/components/layout/Header.astro`

Site header with responsive navigation:
- Logo/site name on the left
- Main navigation links in the center
- CTA buttons and theme toggle on the right
- Mobile hamburger menu with full-screen overlay
- Respects feature flags (hides disabled sections)

### Footer

`src/components/layout/Footer.astro`

Site footer with 5-column layout:
- Brand column with logo, description, contact info, social links
- Product, Solutions, Resources, Company columns
- Legal links in bottom bar
- Respects feature flags

### AnnouncementBar

`src/components/layout/AnnouncementBar.astro`

- Dismissible with localStorage persistence
- Three variants: `primary`, `secondary`, `gradient`
- Optional link

## Section Components

### Hero

`src/components/sections/marketing/Hero.astro`

```astro
<Hero
  title="Main headline"
  subtitle="Supporting text"
  primaryCTA={{ label: "Get Started", href: "/pricing" }}
  secondaryCTA={{ label: "Learn More", href: "/docs" }}
/>
```

### FeaturesSection

`src/components/sections/marketing/FeaturesSection.astro`

Flexible features grid with optional heading.

```astro
<FeaturesSection
  title="Everything you need"
  subtitle="All the tools your team needs."
  features={[
    { icon: "lucide:zap", title: "Fast", description: "Lightning quick" },
    { icon: "lucide:shield", title: "Secure", description: "Enterprise ready" },
  ]}
  background="muted"
/>
```

### HowItWorks

`src/components/sections/marketing/HowItWorks.astro`

Step-by-step process visualization with three layout variants.

```astro
<HowItWorks
  title="How it works"
  subtitle="Get started in 3 simple steps"
  steps={[
    { title: "Sign up", description: "Create your account", icon: "lucide:user-plus" },
    { title: "Connect", description: "Link your repositories", icon: "lucide:git-branch" },
    { title: "Deploy", description: "Push and go live", icon: "lucide:rocket" },
  ]}
  variant="horizontal"  // 'horizontal' | 'vertical' | 'alternating'
  background="muted"
/>
```

### BentoGrid

`src/components/sections/marketing/BentoGrid.astro`

Modern bento-style feature grid with varying card sizes.

```astro
<BentoGrid
  title="Platform Features"
  items={[
    { title: "Fast Deploys", description: "...", icon: "lucide:zap", size: "large", accent: "primary" },
    { title: "Auto Scaling", description: "...", icon: "lucide:trending-up", accent: "blue" },
    { title: "Security", description: "...", icon: "lucide:shield", size: "medium", accent: "green" },
  ]}
/>
```

**Size options:** `small` (default), `medium` (2 columns), `large` (2x2)
**Accent colors:** `primary`, `blue`, `green`, `purple`, `orange`

### FeatureHighlight

`src/components/sections/marketing/FeatureHighlight.astro`

Alternating image/text sections for detailed feature explanations.

```astro
<FeatureHighlight
  title="Powerful Features"
  features={[
    {
      title: "Preview Deployments",
      description: "Every PR gets its own preview URL.",
      image: "/images/features/preview.png",
      badge: "Most Popular",
      highlights: ["Automatic deployment", "Unique URLs", "Password protection"],
      cta: { label: "Learn more", href: "/docs/previews" }
    },
  ]}
  startImageLeft={true}
/>
```

### IntegrationsGrid

`src/components/sections/marketing/IntegrationsGrid.astro`

Display integration logos with optional category filtering.

```astro
<IntegrationsGrid
  title="Integrations"
  subtitle="Connect with your favorite tools"
  integrations={[
    { name: "GitHub", logo: "/images/integrations/github.svg", category: "Development" },
    { name: "Slack", logo: "/images/integrations/slack.svg", category: "Communication" },
  ]}
  variant="grid"  // 'grid' | 'compact' | 'detailed'
  showCategories={true}
/>
```

### CTA

`src/components/sections/marketing/CTA.astro`

```astro
<CTA
  title="Ready to start?"
  description="Get started today."
  action={{ label: "Sign Up", href: "/pricing" }}
  secondaryAction={{ label: "Contact Sales", href: "/contact" }}
  background="accent"
/>
```

### LogoCloud

`src/components/sections/marketing/LogoCloud.astro`

Displays client/partner logos with multiple variants.

```astro
<LogoCloud
  title="Trusted by innovative teams"
  logos={[
    { name: "Acme Inc", src: "/images/logos/acme.svg" },
    { name: "Globex", src: "/images/logos/globex.svg", href: "https://example.com" },
  ]}
  variant="default"  // 'default' | 'marquee' | 'grid'
  grayscale={true}
/>
```

### Newsletter

`src/components/sections/marketing/Newsletter.astro`

Newsletter subscription component.

```astro
<Newsletter
  title="Stay in the loop"
  description="Get weekly updates."
  variant="default"  // 'default' | 'compact' | 'card'
  action="https://api.example.com/subscribe"
/>
```

### VideoEmbed

`src/components/sections/content/VideoEmbed.astro`

Responsive video embed with lazy loading support.

```astro
<VideoEmbed
  title="Product Demo"
  src="https://www.youtube.com/embed/VIDEO_ID"
  aspectRatio="16:9"
  lazyLoad={true}
/>
```

## Pricing Components

### PricingTable

`src/components/sections/pricing/PricingTable.astro`

Displays pricing plans with feature lists and CTA buttons.

```astro
<PricingTable
  title="Simple pricing"
  plans={[
    {
      name: "Free",
      monthlyPrice: 0,
      description: "For side projects",
      features: ["3 projects", "Community support"],
      cta: { label: "Start Free", href: "/register" }
    },
    {
      name: "Pro",
      monthlyPrice: 20,
      description: "For professionals",
      features: ["Unlimited projects", "Priority support"],
      highlighted: true,
      cta: { label: "Start Trial", href: "/register?plan=pro" }
    },
  ]}
  annualDiscount={20}
/>
```

### SecurityBadges

`src/components/sections/pricing/SecurityBadges.astro`

Display compliance and security certifications.

```astro
<SecurityBadges
  title="Security & Compliance"
  badges={[
    { name: "SOC 2", icon: "lucide:shield-check", description: "Type II certified" },
    { name: "GDPR", icon: "lucide:globe", description: "EU compliant" },
  ]}
  variant="cards"  // 'grid' | 'inline' | 'cards'
/>
```

## Social Proof Components

### TestimonialsSection

`src/components/sections/social-proof/TestimonialsSection.astro`

```astro
<TestimonialsSection
  title="Loved by developers"
  testimonials={[
    {
      quote: "This product changed everything.",
      author: "Jane Doe",
      role: "CTO",
      company: "Acme Inc",
      avatar: "/images/testimonials/jane.jpg"
    }
  ]}
/>
```

### CaseStudyCard

`src/components/sections/social-proof/CaseStudyCard.astro`

Customer success stories with metrics.

```astro
<CaseStudyCard
  title="Customer Stories"
  cases={[
    {
      company: "TechCorp",
      logo: "/images/logos/techcorp.svg",
      industry: "Technology",
      quote: "Virex transformed our deployment workflow.",
      author: "John Smith",
      role: "VP Engineering",
      metrics: [
        { value: "95%", label: "Faster deploys" },
        { value: "50%", label: "Cost reduction" },
      ],
      href: "/customers/techcorp"
    }
  ]}
  variant="featured"  // 'grid' | 'featured' | 'compact'
/>
```

### StatsSection

`src/components/sections/social-proof/StatsSection.astro`

Display key metrics and statistics.

```astro
<StatsSection
  stats={[
    { value: "10,000+", label: "Customers" },
    { value: "99.99%", label: "Uptime" },
    { value: "50M+", label: "Deployments" },
  ]}
  background="muted"
/>
```

## Form Components

### ContactForm

`src/components/forms/ContactForm.astro`

Full-featured contact form with validation.

```astro
<!-- Demo mode -->
<ContactForm />

<!-- Netlify Forms -->
<ContactForm netlify formName="contact" />

<!-- Custom endpoint -->
<ContactForm action="https://api.example.com/contact" />
```

### DemoRequestForm

`src/components/forms/DemoRequestForm.astro`

Demo request form with company info and team size.

```astro
<!-- Demo mode -->
<DemoRequestForm />

<!-- Netlify Forms -->
<DemoRequestForm netlify formName="demo-request" />

<!-- Custom endpoint -->
<DemoRequestForm action="https://api.example.com/demo" />
```

### LoginForm / RegisterForm / ForgotPasswordForm

Authentication forms with validation. See [Authentication](/docs/08-authentication.md) for details.

### SocialAuthButtons

`src/components/forms/SocialAuthButtons.astro`

Social login/signup buttons.

```astro
<SocialAuthButtons
  dividerText="Or continue with"
  variant="login"
  googleUrl="/auth/google"
  githubUrl="/auth/github"
/>
```

## Common Components

### SEO

`src/components/common/SEO.astro`

Handles meta tags, Open Graph, Twitter Cards, and JSON-LD.

```astro
<SEO
  title="Page Title"
  description="Page description"
  image="/images/custom-og.png"
  type="article"
/>
```

### OptimizedImage

`src/components/common/OptimizedImage.astro`

Smart image optimization wrapper.

## UI Components

### ThemeToggle

`src/components/ui/ThemeToggle.astro`

Light/dark mode toggle with localStorage persistence.

### Pagination

`src/components/ui/Pagination.astro`

Page navigation for blog listings.

```astro
<Pagination
  currentPage={1}
  totalPages={5}
  basePath="/blog"
/>
```

## Utility Functions

Helper functions in `src/lib/`:

### Reading Time

```typescript
import { calculateReadingTime } from '@/lib/utils';

const minutes = calculateReadingTime(content);
// Returns: 5 (minutes, based on 200 words/min)
```

### Date Formatting

```typescript
import { formatDate } from '@/lib/utils';

formatDate(new Date());
// Returns: "Jan 15, 2025"

formatDate(new Date(), { dateStyle: 'long' });
// Returns: "January 15, 2025"
```

### Form Validation

```typescript
import { required, minLength, email, selected } from '@/lib/validation';

const validators = {
  name: required('Name'),
  message: minLength(10, 'Message'),
  email: email(),
  subject: selected('Subject'),
};
```

## Background Prop

Most section components support a `background` prop for consistent styling:

```astro
<FeaturesSection background="default" />  <!-- White/dark background -->
<FeaturesSection background="muted" />    <!-- Subtle gray background -->
<FeaturesSection background="accent" />   <!-- Primary color tint -->
```

This allows easy visual separation between sections.
