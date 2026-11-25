# Customization

## Logo, Favicon & Open Graph Image

Replace these files in `public/` with your own brand assets:

| File | Purpose | Recommended Size |
|------|---------|------------------|
| `public/logo.svg` | Header logo | Height ~32px (SVG scales) |
| `public/favicon.svg` | Browser tab icon | 32x32px or scalable SVG |
| `public/images/og-image.png` | Social media preview | 1200x630px |

The paths are configured in `src/config/site.ts`:

```typescript
export const logo = '/logo.svg';      // Set to "" to show site name instead
export const ogImage = '/images/og-image.png';
```

Tips:
- Use SVG for logo and favicon — they scale perfectly and support dark mode via CSS
- Keep og-image under 1MB for fast social media loading
- Test your og-image with [opengraph.xyz](https://www.opengraph.xyz/)

## Design Tokens

Customize colors and styling in `src/styles/global.css`:

```css
@theme {
  /* Brand Colors */
  --color-primary: oklch(0.55 0.2 265);
  --color-primary-dark: oklch(0.45 0.2 265);
  --color-secondary: oklch(0.65 0.25 350);

  /* Semantic Colors */
  --color-background: oklch(1 0 0);
  --color-surface: oklch(0.98 0 0);
  --color-text: oklch(0.15 0 0);
  --color-text-muted: oklch(0.45 0 0);
  --color-border: oklch(0.9 0 0);

  /* Status Colors (used in dashboard) */
  --color-success: oklch(0.65 0.2 145);
  --color-warning: oklch(0.75 0.2 85);
  --color-error: oklch(0.6 0.25 25);
  --color-info: oklch(0.6 0.2 240);

  /* Spacing */
  --spacing-section: 6rem;
  --spacing-content: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

### Dark Mode

Dark mode colors are defined in the `.dark` class:

```css
.dark {
  --color-background: oklch(0.15 0 0);
  --color-surface: oklch(0.2 0 0);
  --color-text: oklch(0.95 0 0);
  --color-text-muted: oklch(0.65 0 0);
  --color-border: oklch(0.3 0 0);
}
```

Dark mode uses the `class` strategy with localStorage persistence. Users can toggle via the theme button in the header.

### Using Design Tokens

Tailwind v4 automatically makes tokens available as utilities:

```html
<div class="bg-background text-text">
  <p class="text-text-muted">Muted text</p>
  <button class="bg-primary text-white">Primary button</button>
</div>
```

**Status colors** are available for dashboard components:

```html
<div class="text-success">Success message</div>
<div class="text-warning">Warning message</div>
<div class="text-error">Error message</div>
<div class="text-info">Info message</div>
```

## Dashboard Customization

The dashboard uses the same design tokens as marketing pages for consistency. To customize dashboard-specific styling:

### Dashboard Colors

Dashboard components automatically adapt to your theme colors. The status colors are particularly important for dashboard UI:

```css
@theme {
  --color-success: oklch(0.65 0.2 145);  /* Used in success states, positive trends */
  --color-warning: oklch(0.75 0.2 85);   /* Used in warnings, pending states */
  --color-error: oklch(0.6 0.25 25);     /* Used in errors, negative trends */
  --color-info: oklch(0.6 0.2 240);      /* Used in info messages, neutral states */
}
```

### Dashboard Layout

Customize dashboard layout spacing in `src/components/dashboard/DashboardShell.astro`:

```astro
<!-- Sidebar width -->
<aside class="w-64">  <!-- Change width here -->

<!-- Content padding -->
<main class="p-6">    <!-- Adjust padding -->
```

### Dashboard Components

Dashboard components can be customized by editing files in:
- `src/components/dashboard/` - Layout components (Sidebar, TopNav, etc.)
- `src/components/dashboard-ui/` - UI components (StatCard, DataTable, etc.)

See [Dashboard documentation](./07-dashboard.md#customization) for detailed customization options.

## Typography

The theme uses `@tailwindcss/typography` for prose content. Customize in `global.css`:

```css
.prose {
  --tw-prose-body: var(--color-text);
  --tw-prose-headings: var(--color-text);
  --tw-prose-links: var(--color-primary);
  --tw-prose-code: var(--color-primary);
  --tw-prose-pre-bg: oklch(0.18 0 0);
}
```

## Accessibility

The theme includes built-in accessibility features:

- **Focus states**: Visible focus rings for keyboard navigation
- **Reduced motion**: Respects `prefers-reduced-motion` preference
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color contrast**: Designed for WCAG compliance

```css
/* Enhanced focus states */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Fonts

The theme uses system fonts by default for optimal performance:

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
  "Helvetica Neue", Arial, sans-serif;
```

To use custom fonts:

1. Add font files to `public/fonts/` or use a CDN
2. Import in `src/styles/global.css`:
   ```css
   @font-face {
     font-family: 'YourFont';
     src: url('/fonts/your-font.woff2') format('woff2');
     font-display: swap;
   }

   body {
     font-family: 'YourFont', system-ui, sans-serif;
   }
   ```
