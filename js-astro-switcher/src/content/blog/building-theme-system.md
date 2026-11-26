---
title: "Building a Token-Based Theme System"
description: "Learn how to create a flexible, runtime-switchable theme system using design tokens and CSS custom properties."
pubDate: "2024-02-01"
updatedDate: "2024-02-01"
heroImage: "4.jpg"
tags: ["theming", "design-tokens", "css", "tutorial"]
author: "Astro Theme Switcher"
---

Design tokens are the foundation of a scalable theme system. They provide a single source of truth for design decisions and enable runtime theme switching without rebuilding your application.

## What Are Design Tokens?

Design tokens are name-value pairs that represent design decisions. They abstract design choices like colors, spacing, typography, and shadows into reusable values.

Instead of hardcoding colors throughout your CSS:

```css
/* ❌ Hardcoded values */
.button {
  background-color: #2563eb;
  color: #ffffff;
}
```

You use semantic tokens:

```css
/* ✅ Token-based */
.button {
  background-color: var(--token-color-primary);
  color: var(--token-color-primary-foreground);
}
```

## Benefits of Token-Based Theming

1. **Consistency**: All components use the same tokens, ensuring visual consistency
2. **Flexibility**: Change themes by updating token values
3. **Maintainability**: Update design decisions in one place
4. **Accessibility**: Easy to ensure proper contrast ratios
5. **Runtime Switching**: Users can switch themes without page reload

## Implementing Tokens

Start by defining your tokens in TypeScript:

```typescript
export const tokens = {
  color: {
    primary: '#2563eb',
    primaryForeground: '#ffffff',
    background: '#ffffff',
    // ... more tokens
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
  },
};
```

Then convert them to CSS custom properties:

```typescript
function tokensToCSS(tokens: DesignTokens): string {
  return Object.entries(tokens).map(([key, value]) => {
    return `--token-${key}: ${value};`;
  }).join('\n');
}
```

## Theme Switching

With tokens in place, switching themes is as simple as updating CSS custom properties:

```javascript
function applyTheme(themeId) {
  const theme = themes[themeId];
  const root = document.documentElement;
  
  Object.entries(theme.tokens).forEach(([key, value]) => {
    root.style.setProperty(`--token-${key}`, value);
  });
}
```

This approach gives you powerful, flexible theming that works across all modern browsers!