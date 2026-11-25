---
title: NewCard Component
description: A modern card component with icons, hover effects, and gradient borders for showcasing content.
sidebar:
  order: 2
---

The NewCard component is a versatile, modern card element perfect for showcasing features, services, or content blocks. It includes beautiful styling, icon support, and interactive hover effects.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `icon` | string | No | - | Starlight icon name to display |
| `title` | string | Yes | - | The card title (supports HTML) |
| `iconColor` | string | No | - | Custom color for the icon |
| `size` | string | No | "large" | Card size variant ("large" or "sm") |

## Features

- **Icon Integration** - Uses Starlight's icon system
- **Two Size Variants** - Large (default) and small options
- **Hover Animation** - Arrow icon with rotation effect
- **Gradient Styling** - Modern gradient borders and backgrounds
- **HTML Support** - Title prop supports HTML content
- **Responsive Design** - Adapts to different screen sizes
- **Slot Content** - Accepts custom content in the card body

## Usage Examples

### Basic NewCard
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="Getting Started"
  icon="rocket"
>
  Quick setup guide to get your documentation site running in minutes.
</NewCard>
```

### Small Card Variant
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="Configuration"
  icon="setting"
  size="sm"
>
  Customize your site settings and appearance.
</NewCard>
```

### Card with Custom Icon Color
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";

<NewCard 
  title="API Reference"
  icon="document"
  iconColor="#3b82f6"
>
  Complete API documentation and examples.
</NewCard>
```

### Grid of NewCards
```mdx
import NewCard from "../../../../components/user-components/NewCard.astro";
import Grid from "../../../../components/user-components/Grid.astro";

<Grid columns={3}>
  <NewCard title="Install" icon="add-document">
    Get up and running quickly
  </NewCard>
  
  <NewCard title="Configure" icon="setting">
    Customize your setup
  </NewCard>
  
  <NewCard title="Deploy" icon="rocket">
    Publish your site
  </NewCard>
</Grid>
```

## Size Variants

### Large Cards (Default)
- Full padding (py-12 px-10)
- 2rem icon size
- Includes hover arrow animation
- Best for feature showcases

### Small Cards
- Compact padding (p-6)
- 1.4rem icon size
- No arrow animation
- Perfect for compact layouts

## Icon Support

The component supports all Starlight icons:
- `rocket` - For getting started guides
- `setting` - For configuration topics
- `document` - For documentation pages
- `add-document` - For creation workflows
- And many more from the Starlight icon library

## Styling Features

- **Gradient Borders** - Modern visual appeal
- **Hover Effects** - Interactive arrow rotation
- **Theme Integration** - Works with light/dark themes
- **Group Hover** - Enhanced interactivity
- **Responsive Spacing** - Adapts to screen size

## Best Practices

- Use consistent icon styles across related cards
- Choose appropriate size variants based on content length
- Group related NewCards together for better organization
- Use descriptive titles that clearly indicate the content purpose
- Consider icon color coordination with your theme
- Test hover effects to ensure they enhance user experience