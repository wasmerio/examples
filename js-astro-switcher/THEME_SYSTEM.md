# Token-Based Theme System

## Overview

This project implements a **production-ready, token-based design system** for Astro. Themes are:

- ✅ **Data-driven** - Defined as TypeScript objects, not hardcoded CSS
- ✅ **Runtime-switchable** - Change themes without rebuilds
- ✅ **Fully decoupled** - Components use semantic tokens, not theme-specific values
- ✅ **Type-safe** - Full TypeScript support with autocomplete
- ✅ **Extensible** - Easy to add new themes or modify existing ones
- ✅ **Premium-ready** - Support for premium theme gating

## Quick Start

### Using Tokens in Components

```astro
<!-- Background and text -->
<div style="background-color: var(--token-color-background); color: var(--token-color-text-primary);">
  <p style="color: var(--token-color-text-muted);">Muted text</p>
</div>

<!-- Primary button -->
<button style="background-color: var(--token-color-primary); color: var(--token-color-primary-foreground);">
  Click me
</button>

<!-- With radius and shadow -->
<div style="
  background-color: var(--token-color-surface);
  border-radius: var(--token-radius-lg);
  box-shadow: var(--token-shadow-2);
">
  Card content
</div>
```

### Switching Themes

```typescript
import { setTheme, getTheme } from './utils/themes';

// Switch theme
setTheme('aurora');

// Get current theme
const current = getTheme();
```

## Available Themes

### Free Themes
- **light** - Clean, minimal light theme
- **dark** - Modern dark theme
- **blue** - Calm blue color scheme
- **green** - Fresh green color scheme
- **purple** - Vibrant purple color scheme
- **orange** - Warm orange color scheme

### Premium Themes
- **aurora** - Premium purple gradient theme with elegant shadows
- **obsidian** - Premium deep dark theme with cyan accents

## Token Categories

### 1. Colors
- `--token-color-primary` - Primary brand color
- `--token-color-background` - Main background
- `--token-color-surface` - Card/surface background
- `--token-color-text-primary` - Main text color
- `--token-color-text-muted` - Muted/secondary text
- `--token-color-border` - Border color
- `--token-color-hover` - Hover state
- `--token-color-focus` - Focus ring color
- And more... (see full list in `src/themes/TOKEN_MAPPING.md`)

### 2. Typography
- `--token-font-family-sans` - Sans-serif font stack
- `--token-font-size-base` - Base font size
- `--token-font-weight-bold` - Bold weight
- `--token-line-height-normal` - Normal line height
- And more...

### 3. Radius
- `--token-radius-sm` - Small radius (0.125rem)
- `--token-radius-md` - Medium radius (0.375rem)
- `--token-radius-lg` - Large radius (0.5rem)
- `--token-radius-full` - Full circle (9999px)

### 4. Shadows
- `--token-shadow-1` - Subtle shadow
- `--token-shadow-2` - Light shadow
- `--token-shadow-3` - Medium shadow
- `--token-shadow-4` - Strong shadow
- `--token-shadow-5` - Very strong shadow

### 5. Motion
- `--token-motion-duration-fast` - Fast animation (150ms)
- `--token-motion-duration-normal` - Normal animation (200ms)
- `--token-motion-duration-slow` - Slow animation (300ms)
- `--token-motion-easing-default` - Default easing curve

## Architecture

```
src/themes/
├── types.ts              # Token type definitions
├── utils.ts              # CSS generation, theme application
├── index.ts              # Theme registry
├── themes.css            # Consolidated CSS imports
├── README.md             # Detailed documentation
├── TOKEN_MAPPING.md      # Migration reference
└── [theme-name]/
    ├── tokens.ts         # Token definitions (TypeScript)
    ├── theme.css         # Generated CSS
    └── meta.json         # Theme metadata
```

## Creating a New Theme

See `src/themes/README.md` for detailed instructions.

**Quick version:**
1. Create `src/themes/my-theme/` directory
2. Define tokens in `tokens.ts`
3. Add metadata in `meta.json`
4. Generate CSS (or copy from existing theme)
5. Register in `src/themes/index.ts`
6. Import CSS in `src/themes/themes.css`

## Migration from Old System

If you're migrating from the old `--color-*` system:

1. **Replace variable names** - See `src/themes/TOKEN_MAPPING.md`
2. **Update components** - All components now use `--token-*` variables
3. **Test thoroughly** - Ensure all themes work correctly

**Common mappings:**
- `--color-foreground` → `--token-color-text-primary`
- `--color-background` → `--token-color-background`
- `--color-muted` → `--token-color-surface`
- `--color-muted-foreground` → `--token-color-text-muted`

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors like `#000000`
2. **Use appropriate categories** - Text colors for text, surface colors for backgrounds
3. **Test across themes** - Ensure components work in all available themes
4. **Maintain contrast** - Follow WCAG guidelines
5. **Use motion tokens** - For consistent animations

## Type Safety

All tokens are fully typed:

```typescript
import type { DesignTokens, Theme } from './themes/types';

// Full autocomplete and type checking
const theme: Theme = {
  meta: { id: 'my-theme', name: 'My Theme', /* ... */ },
  tokens: { /* ... */ },
};
```

## Premium Themes

Themes can be marked as premium in `meta.json`:

```json
{
  "premium": true
}
```

Filter themes:

```typescript
import { getPremiumThemes, getFreeThemes } from './themes';

const premium = getPremiumThemes();
const free = getFreeThemes();
```

## Documentation

- **Full Documentation**: `src/themes/README.md`
- **Token Mapping**: `src/themes/TOKEN_MAPPING.md`
- **Type Definitions**: `src/themes/types.ts`
