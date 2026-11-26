# Customization Guide

This guide will help you customize the Healthcare Astro Theme to match your brand and requirements.

## Table of Contents
- [Quick Customization](#quick-customization)
- [Design System](#design-system)
- [Components](#components)
- [Pages](#pages)
- [Tailwind v4 Configuration](#tailwind-v4-configuration)

## Quick Customization

### 1. Update Branding

**Logo:**
Replace `/src/assets/logo.png` with your own logo file. Update the demo brand and contact details in `/src/data/navigation.json`.

**Favicon:**
Replace `/public/favicon.svg` with your own favicon.

**Site Name:**
Update `src/components/Nav.astro` and `src/components/Footer.astro` to change "MedCare Solutions" to your organization name.

### 2. Color Scheme

Edit `/src/styles/tailwind.css` to change the primary color:

```css
@theme {
  /* Change these values */
  --color-theme-primary: #0d9488;       /* Your primary color */
  --color-theme-primary-dark: #0f766e;  /* Darker shade */
  --color-theme-primary-light: #14b8a6; /* Lighter shade */
}
```

### 3. Content

Update page content in `/src/pages/`:
- `index.astro` - Homepage
- `about.astro` - About page
- `services.astro` - Services page
- `contact.astro` - Contact information
- `careers.astro` - Career opportunities
- `info.astro` - FAQ page

---

## Design System

### Color System

All colors are defined in `/src/styles/tailwind.css` using CSS custom properties:

```css
@theme {
  /* Primary Brand Colors */
  --color-theme-primary: #0d9488;
  --color-theme-primary-dark: #0f766e;
  --color-theme-primary-darker: #115e59;
  --color-theme-primary-light: #14b8a6;
  --color-theme-primary-lighter: #5eead4;

  /* Surface Colors */
  --color-theme-surface: #ffffff;
  --color-theme-surface-muted: #f9fafb;
  --color-theme-surface-hover: #f3f4f6;

  /* Text Colors */
  --color-theme-text-primary: #111827;
  --color-theme-text-secondary: #374151;
  --color-theme-text-muted: #6b7280;
  --color-theme-text-on-primary: #ffffff;

  /* Accent Colors */
  --color-theme-accent-sky: #0ea5e9;
  --color-theme-accent-orange: #fb923c;
}
```

**Usage in your code:**
```astro
<div class="bg-theme-primary text-theme-text-on-primary">
  Primary colored box
</div>
```

### Typography System

The theme uses a responsive typography system:

```css
@theme {
  /* Typography Scale - Mobile */
  --font-size-h1-mobile: 2.5rem;     /* 40px */
  --font-size-h2-mobile: 1.875rem;   /* 30px */
  --font-size-h3-mobile: 1.5rem;     /* 24px */

  /* Typography Scale - Desktop */
  --font-size-h1-desktop: 4rem;      /* 64px */
  --font-size-h2-desktop: 2.25rem;   /* 36px */
  --font-size-h3-desktop: 1.875rem;  /* 30px */
}
```

**Using the Heading component:**
```astro
import Heading from '../components/Heading.astro';

<Heading level="h2" align="center" size="section">
  Your Heading Text
</Heading>
```

### Spacing System

The theme uses a consistent vertical spacing system for sections:

**Variables** (`/src/styles/tailwind.css`):
```css
@theme {
  /* Section Spacing */
  --section-spacing: 3rem;         /* 48px mobile */
  --section-spacing-lg: 4rem;      /* 64px desktop */
  --section-spacing-sm: 2rem;      /* 32px mobile */
  --section-spacing-sm-lg: 2.5rem; /* 40px desktop */
}
```

**To change spacing globally:**
```css
/* Make all sections have more space */
--section-spacing: 4rem;      /* was 3rem */
--section-spacing-lg: 5rem;   /* was 4rem */

/* Make all sections have less space */
--section-spacing: 2rem;      /* was 3rem */
--section-spacing-lg: 3rem;   /* was 4rem */
```

**Utility Classes:**
```astro
<!-- Standard spacing -->
<section class="section">...</section>

<!-- Smaller spacing -->
<section class="section-sm">...</section>

<!-- Custom overrides -->
<section class="section section-pt-0">...</section>  <!-- No top padding -->
<section class="section section-pb-0">...</section>  <!-- No bottom padding -->
<section class="section section-gap">...</section>   <!-- 50% less spacing -->
```

### Button System

Buttons use design tokens for consistency:

```css
@theme {
  --button-radius: 9999px;        /* rounded-full */
  --button-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --button-padding-x: 2rem;       /* 32px */
  --button-padding-y: 0.75rem;    /* 12px */
}
```

**Button variants:**
```astro
import Button from '../components/Button.astro';

<Button variant="primary" size="lg" href="/contact">
  Primary Button
</Button>

<Button variant="white" size="base" href="/services">
  White Button
</Button>

<Button variant="white-outline" size="lg" href="/about">
  Outline Button
</Button>
```

---

## Components

### PageHero Component

Used for consistent hero sections across all pages.

**Location:** `/src/components/PageHero.astro`

**Usage:**
```astro
import PageHero from '../components/PageHero.astro';
import heroImage from '../assets/my-hero.jpg';

<PageHero
  title="YOUR PAGE TITLE"
  description="Your page description goes here. Can include HTML tags."
  image={heroImage}
/>
```

**Customization:**
- **Background color:** Edit `class="w-full bg-teal-50 section"` in PageHero.astro
- **Layout:** Currently 50/50 split, modify grid classes to change proportions
- **Image position:** Swap the order of text/image divs

### Heading Component

Provides consistent, semantic headings with responsive sizing.

**Location:** `/src/components/Heading.astro`

**Props:**
```typescript
{
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
  size?: 'default' | 'section' | 'page';
  class?: string;
}
```

**Examples:**
```astro
<!-- Basic heading -->
<Heading level="h2">Section Title</Heading>

<!-- Centered heading -->
<Heading level="h2" align="center">Centered Title</Heading>

<!-- Larger heading variant -->
<Heading level="h2" size="page">Page Title</Heading>

<!-- With custom classes -->
<Heading level="h3" class="mb-8">Title with margin</Heading>

<!-- Using number shorthand -->
<Heading level={2}>Also works</Heading>
```

### Icon Component

SVG icon system with 13 built-in icons.

**Location:** `/src/components/Icon.astro`

**Available icons:**
- `check` - Checkmark
- `arrow-right` - Right arrow
- `chevron-right` - Right chevron
- `chevron-down` - Down chevron
- `phone` - Phone
- `users` - Multiple users
- `clipboard` - Clipboard
- `star` - Star
- `document` - Document
- `video` - Video/play button
- `book` - Book
- `heart` - Heart (medical)
- `medical` - Medical cross

**Usage:**
```astro
import Icon from '../components/Icon.astro';

<Icon name="check" size="md" class="text-teal-600" />
<Icon name="phone" size="lg" class="text-white" />
<Icon name="heart" size="xl" class="text-red-500" />
```

**Adding new icons:**
1. Open `/src/components/Icon.astro`
2. Add the icon name to the `IconName` type
3. Add the icon SVG path data to the `icons` object
4. Update the README

### CallToActionSection

Reusable CTA sections with background images.

**Usage:**
```astro
import CallToActionSection from '../components/CallToActionSection.astro';

<CallToActionSection
  heading="Your CTA Heading"
  subheading="Supporting text goes here"
  primaryButtonText="Get Started"
  primaryButtonLink="/contact"
  secondaryButtonText="Learn More"
  secondaryButtonLink="/services"
/>
```

---

## Pages

### Page Structure

All pages follow this structure:

```astro
---
import Layout from "../layouts/Layout.astro";
import PageHero from "../components/PageHero.astro";
// ... other imports
---

<Layout title="Page Title | Site Name" description="Page description">
  <!-- Hero Section -->
  <PageHero
    title="PAGE NAME"
    description="Page intro text"
    image={heroImage}
  />

  <!-- Content Sections -->
  <section class="section bg-gradient-to-b from-white to-gray-50">
    <div class="container">
      <!-- Section content -->
    </div>
  </section>

  <!-- More sections... -->

  <!-- CTA Section -->
  <CallToActionSection
    heading="CTA Heading"
    subheading="CTA text"
    primaryButtonText="Button Text"
    primaryButtonLink="/link"
  />
</Layout>
```

### Common Section Patterns

**Two-column layout with image:**
```astro
<section class="section bg-white">
  <div class="container">
    <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
      <div>
        <Image src={myImage} alt="Description" class="rounded-2xl shadow-xl" />
      </div>
      <div class="space-y-6">
        <Heading level="h2">Section Title</Heading>
        <p>Content goes here...</p>
      </div>
    </div>
  </div>
</section>
```

**Centered content section:**
```astro
<section class="section bg-gradient-to-b from-gray-50 to-white">
  <div class="container">
    <div class="narrow mx-auto text-center">
      <Heading level="h2" align="center" class="mb-6">
        Section Title
      </Heading>
      <p class="text-lg text-gray-700 leading-relaxed">
        Centered content...
      </p>
    </div>
  </div>
</section>
```

**Grid layout:**
```astro
<section class="section bg-white">
  <div class="container">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Grid items -->
    </div>
  </div>
</section>
```

---

## Tailwind v4 Configuration

### Custom Utilities

Create custom utilities in `/src/styles/tailwind.css`:

```css
@utility your-utility-name {
  property: value;

  @media (width >= theme(--breakpoint-lg)) {
    property: responsive-value;
  }
}
```

**Example:**
```css
@utility feature-card {
  padding: theme(spacing.6);
  border-radius: theme(spacing.3);
  background-color: theme(--color-theme-surface);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);

  &:hover {
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }
}
```

### Breakpoints

Default breakpoints (customizable in `@theme`):

```css
--breakpoint-xs: 475px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-xxl: 1366px;
```

### Container Width

The `container` utility centers content with responsive padding:

```css
@utility container {
  margin-inline: auto;
  padding-inline: theme(spacing.4);        /* 16px mobile */
  max-width: theme(--breakpoint-xxl);      /* 1366px */

  @media (width >= theme(--breakpoint-lg)) {
    padding-inline: theme(spacing.8);      /* 32px desktop */
  }
}
```

To change the max width:
```css
max-width: theme(--breakpoint-xl);  /* 1280px instead */
```

---

## Tips & Best Practices

### 1. Use Design Tokens
Always use theme colors instead of hardcoded values:
```astro
<!-- Good -->
<div class="bg-theme-primary">

<!-- Avoid -->
<div class="bg-teal-600">
```

### 2. Consistent Spacing
Use the section utilities for vertical spacing:
```astro
<!-- Good -->
<section class="section">

<!-- Avoid -->
<section class="py-20">
```

### 3. Component Reusability
Use existing components instead of duplicating code:
```astro
<!-- Good -->
import Heading from '../components/Heading.astro';
<Heading level="h2">Title</Heading>

<!-- Avoid -->
<h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Title</h2>
```

### 4. Responsive Design
The theme is mobile-first. Test on multiple screen sizes and use responsive classes:
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- Responsive grid -->
</div>
```

---

## Need Help?

- Check the main [README.md](README.md) for general information
- Review existing pages in `/src/pages/` for examples
- Examine component files in `/src/components/` for implementation details
- Consult [Astro documentation](https://docs.astro.build) for framework-specific questions
- Check [Tailwind CSS v4 documentation](https://tailwindcss.com/docs) for styling help
