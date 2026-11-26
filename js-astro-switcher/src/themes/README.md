# Theme System Documentation

This is a **token-based, runtime-themeable design system** built for Astro. Themes are data-driven, fully decoupled from components, and switchable at runtime without rebuilds.

## Architecture

### Directory Structure

```
src/themes/
├── types.ts              # TypeScript definitions for tokens
├── utils.ts              # Theme utilities (CSS generation, application)
├── index.ts              # Theme registry
├── themes.css            # Consolidated CSS imports
├── TOKEN_MAPPING.md      # Migration reference
├── light/
│   ├── tokens.ts         # Token definitions
│   ├── theme.css         # Generated CSS
│   └── meta.json         # Theme metadata
├── dark/
│   └── ...
├── aurora/               # Premium theme example
│   └── ...
└── obsidian/             # Premium theme example
    └── ...
```

### Design Tokens

Each theme defines **semantic tokens** across five categories:

1. **Colors** - Semantic color roles (primary, surface, text, borders, states)
2. **Typography** - Font families, sizes, weights, line heights, letter spacing
3. **Radius** - Border radius values (sm, md, lg, xl, 2xl, full)
4. **Shadows** - Elevation shadows (1-5, inner, none)
5. **Motion** - Animation durations and easing functions

## Creating a New Theme

### Step 1: Create Theme Directory

```bash
mkdir -p src/themes/my-theme
```

### Step 2: Define Tokens

Create `src/themes/my-theme/tokens.ts`:

```typescript
import type { DesignTokens } from '../types';

export const tokens: DesignTokens = {
  color: {
    primary: '#your-color',
    primaryForeground: '#ffffff',
    // ... define all color tokens
  },
  typography: {
    // ... define typography tokens
  },
  radius: {
    // ... define radius tokens
  },
  shadow: {
    // ... define shadow tokens
  },
  motion: {
    // ... define motion tokens
  },
};
```

### Step 3: Create Metadata

Create `src/themes/my-theme/meta.json`:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "description": "A beautiful theme",
  "version": "1.0.0",
  "premium": false,
  "tags": ["custom", "example"]
}
```

### Step 4: Generate CSS

The CSS file (`theme.css`) is **automatically generated** from `tokens.ts`. You don't need to write CSS manually!

**Generate CSS for all themes:**
```bash
npm run generate-themes
```

This script:
- Reads all `tokens.ts` files
- Generates `theme.css` for each theme
- Handles light/dark mode variants automatically
- Uses special selectors for `light` (`:root`) and `dark` (`[data-theme="dark"]`) themes

**After modifying tokens:**
Always run `npm run generate-themes` to regenerate the CSS files. The script ensures your CSS stays in sync with your token definitions.

**Note:** The `theme.css` files are generated and should not be edited manually. All changes should be made in `tokens.ts`.

### Step 5: Register Theme

Add to `src/themes/index.ts`:

```typescript
import { tokens as myThemeTokens } from './my-theme/tokens';
import myThemeMeta from './my-theme/meta.json';

export const themes: Theme[] = [
  // ... existing themes
  {
    meta: myThemeMeta as ThemeMeta,
    tokens: myThemeTokens,
  },
];
```

### Step 6: Import CSS

Add to `src/themes/themes.css`:

```css
@import './my-theme/theme.css';
```

## Using Tokens in Components

### In Astro Components

```astro
<div style="background-color: var(--token-color-background); color: var(--token-color-text-primary);">
  <p style="color: var(--token-color-text-muted);">Muted text</p>
</div>
```

### In React Components

```tsx
<div style={{ 
  backgroundColor: 'var(--token-color-background)',
  color: 'var(--token-color-text-primary)',
  borderRadius: 'var(--token-radius-lg)',
  boxShadow: 'var(--token-shadow-2)',
}}>
  Content
</div>
```

### With Tailwind CSS

You can use tokens in Tailwind classes:

```astro
<div class="bg-[var(--token-color-background)] text-[var(--token-color-text-primary)]">
  Content
</div>
```

## Runtime Theme Switching

### Programmatic Theme Change

```typescript
import { setTheme } from '../utils/themes';

// Switch to a theme
setTheme('aurora');
```

### Get Current Theme

```typescript
import { getTheme } from '../utils/themes';

const currentTheme = getTheme();
```

### Initialize Theme System

The theme system initializes automatically, but you can manually initialize:

```typescript
import { initTheme } from '../utils/themes';

initTheme();
```

## Premium Themes

Themes can be marked as premium in their `meta.json`:

```json
{
  "premium": true
}
```

Filter premium themes:

```typescript
import { getPremiumThemes, getFreeThemes } from '../themes';

const premium = getPremiumThemes();
const free = getFreeThemes();
```

## Token Reference

See `TOKEN_MAPPING.md` for a complete mapping of old variable names to new token names.

### Common Tokens

- **Background**: `--token-color-background`
- **Text Primary**: `--token-color-text-primary`
- **Text Muted**: `--token-color-text-muted`
- **Primary**: `--token-color-primary`
- **Border**: `--token-color-border`
- **Surface**: `--token-color-surface`
- **Radius**: `--token-radius-md`
- **Shadow**: `--token-shadow-2`
- **Motion**: `--token-motion-duration-normal`

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors
2. **Use appropriate token categories** - Use `text-primary` for text, not `foreground`
3. **Respect theme boundaries** - Don't mix tokens from different themes
4. **Test all themes** - Ensure components work across all available themes
5. **Maintain contrast** - Follow WCAG guidelines for text contrast

## Migration from Old System

If migrating from the old `--color-*` system:

1. See `TOKEN_MAPPING.md` for variable mappings
2. Replace `--color-foreground` → `--token-color-text-primary`
3. Replace `--color-muted` → `--token-color-surface`
4. Update all component references
5. Test thoroughly across all themes

## Type Safety

All tokens are fully typed:

```typescript
import type { DesignTokens, Theme } from '../themes/types';

const theme: Theme = {
  meta: { /* ... */ },
  tokens: { /* ... */ },
};
```

This ensures compile-time safety and excellent IDE autocomplete.
