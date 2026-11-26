# Components Documentation

## Contact Components

### ContactForm

Contact form with validation and multiple integration options.

**Location:** `src/components/contact/ContactForm.astro`

**Props:**

```typescript
interface Props {
  title?: string; // Form title
  description?: string; // Form description
}
```

**Usage:**

```astro
<ContactForm title="Get in Touch" description="We'll respond within 24 hours" />
```

### ContactValue

Displays contact information with proper links.

**Location:** `src/components/common/ContactValue.astro`

**Props:**

```typescript
interface Props {
  data: string; // URL or contact data
  displayText?: string; // Display text (optional)
  classes?: string; // CSS classes
  externalLink?: boolean; // Open in new tab
}
```

## Common Components

### Layout

Main page layout with meta tags and navigation.

**Location:** `src/layouts/Layout.astro`

**Props:**

```typescript
interface Props {
  title: string;
  description?: string;
  image?: string;
  canonical?: string;
}
```

## Adding New Components

1. Create component file in appropriate folder
2. Add TypeScript interface for props
3. Include documentation comments
4. Export from index file if needed

Example:

```astro
---
interface Props {
  title: string;
  variant?: "primary" | "secondary";
}

const { title, variant = "primary" } = Astro.props;
---

<!-- Component template -->
<div class={`component ${variant}`}>
  <h2>{title}</h2>
  <slot />
</div>
```
