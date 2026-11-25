---
title: Adding Document
description: Learn how to create and organize new documentation pages in your Dockit site.
---

# Adding New Documentation Pages

This guide will walk you through the process of adding new documentation pages to your Dockit site, organizing them properly, and ensuring they appear in the navigation.

## File Structure

All documentation files are located in the `src/content/docs/` directory. The structure looks like this:

```
src/content/docs/
├── index.mdx                 # Homepage
├── getting-started/          # Getting started section
│   ├── introduction/
│   ├── global-settings/
│   └── navigation.md
├── guides/                   # Guides section
│   └── example.md
├── reference/                # Reference section
│   ├── configuration.mdx
│   └── example.mdx
├── resources/                # Resources section
│   ├── community-content.mdx
│   ├── plugins.mdx
│   ├── showcase.mdx
│   └── themes.mdx
└── contents/                 # Additional content
    ├── components/
    └── editing/
```

## Creating a New Page

### Step 1: Create the File

Create a new `.md` or `.mdx` file in the appropriate directory:

**For Markdown (.md):**
```bash
touch src/content/docs/guides/my-new-guide.md
```

**For MDX (.mdx) - with React components:**
```bash
touch src/content/docs/guides/my-advanced-guide.mdx
```

### Step 2: Add Frontmatter

Every documentation page must start with YAML frontmatter:

```markdown
---
title: My New Guide
description: A comprehensive guide to using advanced features.
---

# My New Guide

Your content goes here...
```

### Required Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (appears in browser tab and navigation) |
| `description` | string | Page description for SEO and previews |

### Optional Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `sidebar.order` | number | Custom ordering in sidebar |
| `sidebar.label` | string | Custom label in sidebar (defaults to title) |
| `sidebar.hidden` | boolean | Hide page from sidebar navigation |
| `editUrl` | boolean/string | Enable/disable edit link or set custom URL |
| `lastUpdated` | boolean | Show last updated date |
| `prev` | boolean/object | Configure previous page link |
| `next` | boolean/object | Configure next page link |
| `hero` | object | Add hero section (for splash pages) |
| `banner` | object | Add banner message |
| `draft` | boolean | Mark as draft (won't build in production) |

## Adding to Navigation

### Method 1: Automatic Generation

For directories with multiple pages, use autogenerate in `src/config/config.json`:

```json
{
  "label": "My Section",
  "autogenerate": { "directory": "guides" }
}
```

### Method 2: Manual Configuration

For specific pages or custom organization:

```json
{
  "label": "Getting Started",
  "items": [
    {
      "label": "Introduction",
      "slug": "getting-started/introduction"
    },
    {
      "label": "Quick Start",
      "slug": "getting-started/quick-start"
    }
  ]
}
```

### Method 3: Mixed Approach

Combine autogenerate with manual items:

```json
{
  "label": "Guides",
  "items": [
    {
      "label": "Essential Guide",
      "slug": "guides/essential"
    },
    {
      "label": "Advanced Guides",
      "autogenerate": { "directory": "guides/advanced" }
    }
  ]
}
```

## Content Examples

### Basic Markdown Page

```markdown
---
title: Getting Started with Components
description: Learn how to use and customize components in your documentation.
---

# Getting Started with Components

This guide covers the basics of working with components.

## Overview

Components are reusable pieces of content that help maintain consistency.

### Key Benefits

- **Reusability**: Use the same component across multiple pages
- **Consistency**: Maintain uniform styling and behavior
- **Maintainability**: Update once, reflect everywhere

## Usage

To use a component:

1. Import it at the top of your MDX file
2. Use it in your content
3. Pass any required props

```mdx
import { Card } from '@astrojs/starlight/components';

<Card title="Example Card">
  This is card content.
</Card>
```

## Next Steps

- [Advanced Components](./advanced-components)
- [Custom Styling](./custom-styling)
```

### MDX Page with Components

```mdx
---
title: Interactive Examples
description: Examples with interactive components and code previews.
---

import { Tabs, TabItem, Code } from '@astrojs/starlight/components';
import NewCard from '~/components/user-components/NewCard.astro';

# Interactive Examples

This page demonstrates interactive components.

<Tabs>
<TabItem label="Preview">
<NewCard title="Example Card" icon="rocket">
  This is an example of the NewCard component.
</NewCard>
</TabItem>
<TabItem label="Code">
```astro
<NewCard title="Example Card" icon="rocket">
  This is an example of the NewCard component.
</NewCard>
```
</TabItem>
</Tabs>

## Code Examples

<Code code={`console.log("Hello, World!");`} lang="js" title="example.js" />
```

## Creating New Sections

### Step 1: Create Directory Structure

```bash
mkdir -p src/content/docs/my-new-section
```

### Step 2: Add Pages

```bash
touch src/content/docs/my-new-section/overview.md
touch src/content/docs/my-new-section/getting-started.md
touch src/content/docs/my-new-section/advanced-usage.md
```

### Step 3: Update Navigation

Add to `src/config/config.json`:

```json
{
  "sidebar": [
    // ... existing sections
    {
      "label": "My New Section",
      "items": [
        {
          "label": "Overview", 
          "slug": "my-new-section/overview"
        },
        {
          "label": "Getting Started",
          "slug": "my-new-section/getting-started" 
        },
        {
          "label": "Advanced Usage",
          "slug": "my-new-section/advanced-usage"
        }
      ]
    }
  ]
}
```

## Best Practices

### File Naming

- Use kebab-case for file names: `my-guide.md`
- Be descriptive but concise
- Match the URL structure you want

### Content Organization

1. **Logical Grouping**: Group related content in directories
2. **Progressive Disclosure**: Start with basics, advance to complex topics
3. **Cross-References**: Link related pages together
4. **Consistent Structure**: Use similar headings and organization

### Writing Guidelines

1. **Clear Titles**: Make titles descriptive and searchable
2. **Good Descriptions**: Write compelling descriptions for SEO
3. **Proper Headers**: Use h1 for page title, h2 for main sections
4. **Code Examples**: Provide working, copy-paste-ready examples
5. **Visual Elements**: Use components, tables, and callouts for clarity

### SEO and Accessibility

- Write descriptive `title` and `description` frontmatter
- Use proper heading hierarchy (h1 → h2 → h3)
- Add alt text to images
- Use semantic HTML elements
- Test with screen readers

## Troubleshooting

### Page Not Appearing in Navigation

1. Check file is in correct directory
2. Verify frontmatter syntax
3. Ensure page is added to `config.json` sidebar
4. Restart development server

### Build Errors

1. Validate YAML frontmatter syntax
2. Check for missing imports in MDX files
3. Ensure all referenced files exist
4. Review component syntax

### Navigation Order Issues

1. Use `sidebar.order` in frontmatter for custom ordering
2. Check alphabetical sorting in autogenerated sections
3. Verify manual ordering in config.json

## Advanced Features

### Custom Page Layouts

Use the `template` frontmatter field:

```markdown
---
title: Landing Page
template: splash
hero:
  title: Welcome to Our Docs
  tagline: Everything you need to get started
---
```

### Page-Specific Styling

Add custom CSS classes:

```markdown
---
title: Styled Page
---

<div class="custom-content">
  # Custom Styled Content
  
  This content has custom styling applied.
</div>

<style>
.custom-content {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  padding: 2rem;
  border-radius: 8px;
}
</style>
```

### Conditional Content

Use MDX to show content conditionally:

```mdx
import { Aside } from '@astrojs/starlight/components';

# Feature Documentation

{process.env.NODE_ENV === 'development' && (
  <Aside type="caution">
    This feature is still in development.
  </Aside>
)}

Regular documentation content...
```

## Next Steps

- [Customizing Components](../components/)
- [Advanced Configuration](../configuration/)
- [Deployment Guide](../deployment/)
