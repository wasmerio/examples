# Architecture Documentation

This document explains the architectural decisions and patterns used in this themeable Astro system.

## Core Principles

1. **Separation of Concerns**: Theme logic is completely separate from UI logic
2. **Framework Agnostic**: Core theme system works with any framework (only Astro + Tailwind required)
3. **Semantic Tokens**: All styling uses semantic tokens, never hardcoded values
4. **Runtime Theming**: Themes switch at runtime without rebuilds
5. **Production Ready**: Code is written for commercial sale and resale

## Directory Structure

```
src/
├── themes/              # Theme system (completely decoupled from UI)
│   ├── types.ts         # TypeScript definitions for tokens
│   ├── utils.ts         # Core theme utilities (CSS generation, application)
│   ├── index.ts         # Theme registry
│   ├── themes.css       # Consolidated CSS imports
│   └── [theme-name]/    # Individual theme definitions
│       ├── tokens.ts    # Token definitions (TypeScript)
│       ├── theme.css    # Generated CSS
│       └── meta.json    # Theme metadata
│
├── components/
│   ├── ui/              # Reusable UI component library
│   │   ├── Button.astro
│   │   ├── Card.astro
│   │   └── ...
│   └── [page-components] # Page-specific components
│
└── utils/
    └── themes.ts        # High-level theme API for components
```

## Architecture Decisions

### 1. Token-Based System

**Decision**: Use semantic design tokens instead of raw color values.

**Why**:
- Themes can be swapped without changing component code
- Tokens provide meaning (primary, surface) vs raw values (#3b82f6)
- Easy to maintain and extend
- Type-safe with TypeScript

**Implementation**: All tokens use `--token-*` prefix to avoid conflicts and make purpose clear.

### 2. Attribute Selectors for Themes

**Decision**: Use `[data-theme="id"][data-mode="light|dark"]` instead of classes.

**Why**:
- Attributes are easier to manipulate at runtime
- No class name conflicts
- Clear separation: theme (color) vs mode (light/dark)
- Works seamlessly with Astro view transitions

**Implementation**: Themes are applied via `document.documentElement.setAttribute()`.

### 3. Separation of Theme Logic and UI Logic

**Decision**: Keep theme system completely separate from components.

**Why**:
- Theme system can be used independently
- Components don't need to know about theme internals
- Easy to swap theme system implementation
- Clear boundaries for testing and maintenance

**Structure**:
- `src/themes/` - Pure theme logic (no UI dependencies)
- `src/components/ui/` - UI components (depend on tokens, not theme system)
- `src/utils/themes.ts` - Bridge layer (convenience API)

### 4. Framework Agnostic Core

**Decision**: Core theme system has no framework dependencies beyond Astro.

**Why**:
- Can be used with any UI framework (React, Vue, Svelte, vanilla)
- No vendor lock-in
- Easy to integrate into existing projects
- Future-proof

**Implementation**: 
- Theme utilities are pure functions
- CSS-based theming (no JavaScript required for basic usage)
- React components are optional (only for interactive UI)

### 5. Runtime Theme Switching

**Decision**: Themes switch at runtime without page reload or rebuild.

**Why**:
- Better user experience
- No server round-trip needed
- Works with static site generation
- Instant feedback

**Implementation**:
- CSS custom properties change via data attributes
- localStorage persists preferences
- Custom events notify React components

### 6. Motion Token System

**Decision**: All animations use motion tokens, not hardcoded durations.

**Why**:
- Consistent timing across all themes
- Easy to adjust animation speed globally
- Respects user preferences (reduced motion)
- Theme-specific motion characteristics possible

**Implementation**: `--token-motion-duration-*` and `--token-motion-easing-*` variables.

## Component Architecture

### UI Components

All UI components in `src/components/ui/` follow these rules:

1. **No hardcoded colors** - Always use `var(--token-color-*)`
2. **No hardcoded motion** - Always use `var(--token-motion-*)`
3. **Accessible by default** - ARIA attributes, keyboard navigation, focus states
4. **Framework agnostic** - Pure Astro components (React only for interactivity)
5. **Clear props** - Well-documented interfaces with sensible defaults

### Example Component Pattern

```astro
---
/**
 * Component documentation explaining:
 * - What it does
 * - Architecture decisions
 * - Why certain patterns were chosen
 */

export interface Props {
  // Clear, typed props
}

// Use semantic tokens only
const style = {
  background: 'var(--token-color-surface)',
  // ...
};

// Use motion tokens
const duration = 'var(--token-motion-duration-normal)';
---
```

## Adding New Themes

The theme system is designed for easy extension:

1. Create theme directory: `src/themes/my-theme/`
2. Define tokens: `tokens.ts` (TypeScript)
3. Add metadata: `meta.json`
4. Generate CSS: `theme.css` (can be automated)
5. Register: Add to `src/themes/index.ts`
6. Import CSS: Add to `src/themes/themes.css`

No component changes needed - components automatically work with new themes.

## Framework Dependencies

**Required**:
- Astro (SSG framework)
- Tailwind CSS (utility-first CSS)

**Optional**:
- React (only for interactive components like ThemeSwitcher)
- Framer Motion (only for ScrollReveal animations)

**Not Used**:
- Vue, Svelte, Angular (core system doesn't require them)
- CSS-in-JS libraries (we use CSS custom properties)
- Theme-specific frameworks (we built our own)

## Code Quality Standards

1. **Inline Comments**: Explain "why" not "what"
2. **Clear Naming**: Semantic names that explain purpose
3. **No Abstractions**: Avoid unnecessary layers or indirection
4. **Readable Code**: Favor clarity over cleverness
5. **Production Ready**: Code suitable for commercial sale

## Extensibility

This system is designed to:

1. **Power multiple sites** - Same theme system, different content
2. **Easy theme addition** - Add themes without touching components
3. **Premium features** - Built-in support for premium theme gating
4. **Customization** - Easy to modify for specific needs

## Commercial Readiness

The codebase is structured for:

- **Resale**: Clear architecture, well-documented
- **White-labeling**: Easy to rebrand and customize
- **Agency use**: Can power multiple client sites
- **Developer adoption**: Clear patterns, easy to extend
