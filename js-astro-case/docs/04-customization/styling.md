# Styling

This theme uses modern CSS with custom properties. All styles are easily customizable.

## Color System

Edit CSS custom properties in `src/styles/global.css`:

### Dark Mode (Default)

```css
:root {
  --color-bg: #0a0a0a;
  --color-bg-secondary: #111111;
  --color-bg-elevated: #1a1a1a;
  --color-text: #e5e5e5;
  --color-text-secondary: #a3a3a3;
  --color-text-muted: #737373;
  --color-border: #262626;
  --color-accent: #3b82f6;
  --color-accent-hover: #60a5fa;
}
```

### Light Mode

```css
[data-theme="light"] {
  --color-bg: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-elevated: #fafafa;
  --color-text: #171717;
  --color-text-secondary: #525252;
  --color-text-muted: #a3a3a3;
  --color-border: #e5e5e5;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
}
```

### Changing the Accent Color

Update these variables for both modes:

```css
:root {
  --color-accent: #10b981;
  --color-accent-hover: #34d399;
  --color-accent-muted: rgba(16, 185, 129, 0.15);
  --color-accent-glow: rgba(16, 185, 129, 0.25);
}

[data-theme="light"] {
  --color-accent: #059669;
  --color-accent-hover: #047857;
  --color-accent-muted: rgba(5, 150, 105, 0.1);
  --color-accent-glow: rgba(5, 150, 105, 0.15);
}
```

## Typography

```css
:root {
  /* Font Sizes */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### Custom Fonts

Update `src/styles/global.css`:

```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

Import in `src/layouts/BaseLayout.astro`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Spacing

```css
:root {
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2rem;      /* 32px */
  --space-2xl: 3rem;     /* 48px */
  --space-3xl: 4rem;     /* 64px */
}
```

## Layout

```css
:root {
  --max-width-prose: 65ch;      /* Reading content */
  --max-width-content: 1200px;  /* Page content */
  
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.5rem;
  --border-radius-lg: 1rem;
}
```

## Responsive Breakpoints

The theme uses consistent breakpoints:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 480px | Small mobile adjustments |
| `md` | 640px | Tablets and large phones |
| `lg` | 768px | Tablets landscape, small laptops |
| `xl` | 1024px | Desktops (rarely used) |

### Common Patterns

```css
/* Desktop default */
.card {
  padding: 2rem;
}

/* Reduce on mobile */
@media (max-width: 640px) {
  .card {
    padding: 1.25rem;
  }
}
```

| Component | Desktop | Mobile (≤768px) | Mobile (≤640px) |
|-----------|---------|-----------------|-----------------|
| Page padding | 2rem | 1.5rem | 1rem |
| Card padding | 2rem | - | 1.25rem |
| Heading sizes | Full scale | Reduced ~20% | - |

## Theme Toggle

The theme toggle supports manual selection and system preference detection.

**Theme Persistence:**
- User preference saved to `localStorage`
- Falls back to system preference
- Prevents flash of wrong theme on load

**Customizing default theme:**

Edit `src/components/ThemeToggle.astro`:

```javascript
// Force dark as default
const theme = stored || 'dark';

// Force light as default
const theme = stored || 'light';
```

## Reading Time

Automatic reading time estimation uses 200 WPM (optimized for technical content).

**Customize in `src/utils/readingTime.ts`:**

```typescript
const WORDS_PER_MINUTE = 200; // Change this
```

## View Transitions

Smooth page navigation is enabled via Astro's View Transitions.

**Disabling:**

Remove `<ClientRouter />` from `src/layouts/BaseLayout.astro`.
