# Token Mapping Reference

This document maps the old CSS variable names to the new semantic token names.

## Color Tokens

### Primary Colors
- `--color-primary` → `--token-color-primary`
- `--color-primary-foreground` → `--token-color-primary-foreground`

### Background & Surface
- `--color-background` → `--token-color-background`
- `--color-muted` → `--token-color-surface`
- (new) `--token-color-surface-elevated` - For elevated surfaces like modals

### Text Colors
- `--color-foreground` → `--token-color-text-primary`
- `--color-muted-foreground` → `--token-color-text-muted`
- (new) `--token-color-text-secondary` - For secondary text
- (new) `--token-color-text-inverse` - For text on colored backgrounds

### Borders
- `--color-border` → `--token-color-border`
- (new) `--token-color-border-muted` - For subtle borders
- (new) `--token-color-border-strong` - For prominent borders

### Secondary & Accent
- `--color-secondary` → `--token-color-secondary`
- `--color-secondary-foreground` → `--token-color-secondary-foreground`
- `--color-accent` → `--token-color-accent`
- `--color-accent-foreground` → `--token-color-accent-foreground`

### State Colors (New)
- `--token-color-success` / `--token-color-success-foreground`
- `--token-color-warning` / `--token-color-warning-foreground`
- `--token-color-error` / `--token-color-error-foreground`
- `--token-color-info` / `--token-color-info-foreground`

### Interactive States (New)
- `--token-color-hover` - Hover state background
- `--token-color-active` - Active/pressed state
- `--token-color-focus` - Focus ring color

## Typography Tokens (New)

### Font Families
- `--token-font-family-sans`
- `--token-font-family-serif`
- `--token-font-family-mono`

### Font Sizes
- `--token-font-size-xs` through `--token-font-size-5xl`

### Font Weights
- `--token-font-weight-normal` (400)
- `--token-font-weight-medium` (500)
- `--token-font-weight-semibold` (600)
- `--token-font-weight-bold` (700)

### Line Heights
- `--token-line-height-tight` (1.25)
- `--token-line-height-normal` (1.5)
- `--token-line-height-relaxed` (1.75)
- `--token-line-height-loose` (2)

### Letter Spacing
- `--token-letter-spacing-tight`
- `--token-letter-spacing-normal`
- `--token-letter-spacing-wide`

## Radius Tokens (New)

- `--token-radius-none`
- `--token-radius-sm`
- `--token-radius-md`
- `--token-radius-lg`
- `--token-radius-xl`
- `--token-radius-2xl`
- `--token-radius-full`

## Shadow Tokens (New)

- `--token-shadow-1` through `--token-shadow-5`
- `--token-shadow-inner`
- `--token-shadow-none`

## Motion Tokens (New)

### Durations
- `--token-motion-duration-fast` (150ms)
- `--token-motion-duration-normal` (200ms)
- `--token-motion-duration-slow` (300ms)

### Easing
- `--token-motion-easing-default`
- `--token-motion-easing-in`
- `--token-motion-easing-out`
- `--token-motion-easing-in-out`

## Migration Example

### Before
```astro
<div style="background-color: var(--color-background); color: var(--color-foreground);">
  <p style="color: var(--color-muted-foreground);">Text</p>
</div>
```

### After
```astro
<div style="background-color: var(--token-color-background); color: var(--token-color-text-primary);">
  <p style="color: var(--token-color-text-muted);">Text</p>
</div>
```
