# Theme System Documentation

This project includes a comprehensive theme switcher system that uses CSS custom properties and Tailwind CSS v4.

## Available Themes

- **Light** - Default light theme (black & white)
- **Dark** - Dark mode theme
- **Blue** - Blue color scheme
- **Green** - Green color scheme
- **Purple** - Purple color scheme
- **Orange** - Orange color scheme

## How It Works

The theme system uses:
1. **CSS Custom Properties** - Defined in `src/styles/themes.css`
2. **Data Attributes** - Themes are applied via `data-theme` attribute on `<html>`
3. **localStorage** - User's theme preference is saved
4. **Theme Switcher Component** - React component in the header

## Adding a New Theme

### Step 1: Add CSS Theme Definition

Edit `src/styles/themes.css` and add a new theme block:

```css
/* Red Theme */
[data-theme="red"] {
  --color-background: #fef2f2;
  --color-foreground: #7f1d1d;
  --color-muted: #fee2e2;
  --color-muted-foreground: #dc2626;
  --color-border: #fecaca;
  --color-primary: #ef4444;
  --color-primary-foreground: #ffffff;
  --color-secondary: #fee2e2;
  --color-secondary-foreground: #7f1d1d;
  --color-accent: #fecaca;
  --color-accent-foreground: #7f1d1d;
}
```

### Step 2: Update Theme Types

Edit `src/utils/themes.ts`:

```typescript
export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange' | 'red';

export const themes: Theme[] = ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'red'];

export const themeNames: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  blue: 'Blue',
  green: 'Green',
  purple: 'Purple',
  orange: 'Orange',
  red: 'Red', // Add your new theme name
};
```

That's it! The theme will automatically appear in the theme switcher.

## Using Theme Variables in Components

You can use theme variables in your components:

```astro
<div style="background-color: var(--color-background); color: var(--color-foreground);">
  Content
</div>
```

Or with Tailwind classes (if you configure Tailwind to use these variables):

```astro
<div class="bg-[var(--color-background)] text-[var(--color-foreground)]">
  Content
</div>
```

## Theme Generator Utility

The `src/utils/themeGenerator.ts` file provides utilities to programmatically generate themes:

```typescript
import { generateThemeCSS, generateThemeFromColor } from '../utils/themeGenerator';

// Generate CSS for a custom theme
const customTheme = generateThemeCSS('custom', {
  background: '#ffffff',
  foreground: '#000000',
  // ... other colors
});

// Generate a theme from a base color
const blueTheme = generateThemeFromColor('blue', '#2563eb', false);
```

## Theme Color Properties

Each theme defines these CSS custom properties:

- `--color-background` - Main background color
- `--color-foreground` - Main text color
- `--color-muted` - Muted background (e.g., cards, sections)
- `--color-muted-foreground` - Muted text color
- `--color-border` - Border color
- `--color-primary` - Primary brand color
- `--color-primary-foreground` - Text on primary color
- `--color-secondary` - Secondary background
- `--color-secondary-foreground` - Text on secondary
- `--color-accent` - Accent/highlight color
- `--color-accent-foreground` - Text on accent

## Persistence

The selected theme is automatically saved to `localStorage` and persists across page reloads. The system also respects the user's system preference (dark/light mode) on first visit.

## Accessibility

The theme switcher includes proper ARIA labels and keyboard navigation support. Theme transitions are smooth and respect `prefers-reduced-motion` settings.
