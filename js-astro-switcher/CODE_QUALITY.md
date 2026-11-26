# Code Quality Standards

This document outlines the code quality standards and expectations for this themeable Astro system.

## Documentation Standards

### Inline Comments

All code should include inline comments that explain **why** decisions were made, not just **what** the code does.

**Good Example**:
```typescript
/**
 * Architecture Decision: We use data attributes instead of classes because:
 * 1. Attributes are easier to manipulate at runtime
 * 2. No class name conflicts
 * 3. Works seamlessly with Astro view transitions
 */
document.documentElement.setAttribute('data-theme', themeId);
```

**Bad Example**:
```typescript
// Set the theme attribute
document.documentElement.setAttribute('data-theme', themeId);
```

### File Headers

Every significant file should have a header comment explaining:
- What the file does
- Key architecture decisions
- How it fits into the overall system

## Separation of Concerns

### Theme Logic vs UI Logic

**Theme Logic** (`src/themes/`):
- Pure functions for theme operations
- No UI dependencies
- Framework-agnostic
- Can be used independently

**UI Logic** (`src/components/ui/`):
- Component rendering and behavior
- Uses tokens, doesn't know about theme internals
- Framework-specific (Astro, React) as needed

**Bridge Layer** (`src/utils/themes.ts`):
- Convenience API for components
- Wraps core theme utilities
- Provides type-safe interfaces

### Clear Boundaries

- Components should never import directly from `src/themes/utils.ts`
- Components should use `src/utils/themes.ts` for theme operations
- Theme system should never depend on components

## Code Clarity

### Favor Clarity Over Cleverness

**Good**:
```typescript
const theme = storedTheme && availableThemes.includes(storedTheme) 
  ? storedTheme 
  : 'blue';
```

**Bad**:
```typescript
const theme = availableThemes.find(t => t === storedTheme) ?? 'blue';
```

### No Unnecessary Abstractions

Avoid creating abstraction layers unless they provide clear value:

**Good**: Direct function calls
```typescript
applyTheme(themeId, mode);
```

**Bad**: Unnecessary wrapper
```typescript
ThemeManager.getInstance().applyThemeWithMode(themeId, mode);
```

### Readable Code

- Use descriptive variable names
- Break complex operations into steps
- Add comments for non-obvious logic
- Keep functions focused and small

## Framework Dependencies

### Required
- **Astro**: SSG framework (core requirement)
- **Tailwind CSS**: Utility-first CSS (styling system)

### Optional
- **React**: Only for interactive components (ThemeSwitcher, ModeToggle, ScrollReveal)
- **Framer Motion**: Only for ScrollReveal animations

### Not Used
- Vue, Svelte, Angular (core system doesn't require them)
- CSS-in-JS (we use CSS custom properties)
- Theme-specific frameworks (we built our own)

### Framework Lock-In

The core theme system (`src/themes/`) has **zero framework dependencies**. It can be used with:
- Any UI framework (React, Vue, Svelte, vanilla JS)
- Any build tool (Vite, Webpack, etc.)
- Any deployment target (static, server, edge)

Only the UI components in `src/components/ui/` use Astro, which is the intended framework for this system.

## Production Readiness

### Code Quality Checklist

- [x] All components use semantic tokens (no hardcoded colors)
- [x] Architecture decisions documented inline
- [x] Clear separation of theme logic and UI logic
- [x] No unnecessary abstractions
- [x] Framework-agnostic core system
- [x] Accessible by default
- [x] Type-safe with TypeScript
- [x] Well-documented with examples

### Commercial Readiness

The codebase is structured for:

1. **Resale**: Clear architecture, comprehensive documentation
2. **White-labeling**: Easy to rebrand and customize
3. **Agency use**: Can power multiple client sites
4. **Developer adoption**: Clear patterns, easy to extend

## Extensibility

The system is designed to:

1. **Power multiple sites**: Same theme system, different content
2. **Easy theme addition**: Add themes without touching components
3. **Premium features**: Built-in support for premium theme gating
4. **Customization**: Easy to modify for specific needs

## Testing Considerations

While not explicitly tested in this codebase, the architecture supports:

- **Unit testing**: Pure functions in `src/themes/utils.ts`
- **Component testing**: Astro components can be tested
- **Integration testing**: Theme switching can be tested
- **Visual regression**: Theme changes are CSS-based

## Performance

- **No runtime overhead**: Theme switching is pure CSS
- **Minimal JavaScript**: Only for interactive components
- **Tree-shakeable**: Unused themes can be eliminated
- **Static-friendly**: Works with static site generation
