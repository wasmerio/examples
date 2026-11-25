---
title: Grid Component
description: A flexible grid layout system for organizing content in responsive columns.
sidebar:
  order: 4
---

The Grid component provides a responsive grid layout system that automatically adapts to different screen sizes, making it perfect for organizing cards, content blocks, or any other elements.

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | number | No | 2 | Number of columns to display on larger screens |

## Features

- **Responsive Design** - Automatically adjusts from multi-column to single column on mobile
- **Flexible Columns** - Supports 1-6 columns on larger screens
- **Automatic Spacing** - Consistent gaps between grid items
- **Slot Content** - Accepts any content as children
- **Mobile-First** - Single column on small screens, customizable on larger screens

## Usage Examples

### Two Column Grid (Default)
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid>
  <Card title="Feature One">
    Description of the first feature
  </Card>
  <Card title="Feature Two">
    Description of the second feature
  </Card>
</Grid>
```

### Three Column Grid
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid columns={3}>
  <Card title="Getting Started">
    Quick start guide
  </Card>
  <Card title="Configuration">
    Setup and customization
  </Card>
  <Card title="Deployment">
    Publishing your site
  </Card>
</Grid>
```

### Four Column Grid
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card } from '@astrojs/starlight/components';

<Grid columns={4}>
  <Card title="HTML">
    Semantic markup
  </Card>
  <Card title="CSS">
    Modern styling
  </Card>
  <Card title="JavaScript">
    Interactive features
  </Card>
  <Card title="Astro">
    Static site generation
  </Card>
</Grid>
```

### Mixed Content Grid
```mdx
import Grid from "../../../../components/user-components/Grid.astro";
import { Card, Badge } from '@astrojs/starlight/components';

<Grid columns={2}>
  <div>
    <h3>Documentation</h3>
    <p>Complete guides and API reference</p>
    <Badge text="Updated" variant="success" />
  </div>
  
  <Card title="Quick Links">
    - [Installation](/install)
    - [Configuration](/config)
    - [Examples](/examples)
  </Card>
</Grid>
```

## Responsive Behavior

The Grid component automatically adapts to different screen sizes:

- **Mobile (< 768px)** - Always displays single column regardless of `columns` prop
- **Tablet & Desktop (≥ 768px)** - Uses the specified number of columns

## Column Options

You can specify any number of columns, but common configurations are:

- `columns={1}` - Single column (useful for overriding default)
- `columns={2}` - Two columns (default)
- `columns={3}` - Three columns (great for feature lists)
- `columns={4}` - Four columns (compact layouts)
- `columns={5}` - Five columns (for many small items)
- `columns={6}` - Six columns (maximum recommended)

## Styling

The component uses CSS custom properties for flexible column management:
- Uses CSS Grid for layout
- Automatic gap spacing (1rem)
- Responsive breakpoints
- Compatible with Starlight's design system

## Best Practices

- Use 2-3 columns for most content layouts
- Ensure grid items have similar content lengths for best visual balance
- Test on mobile devices to ensure single-column layout works well
- Consider using fewer columns for content-heavy items
- Group related items within the same grid for better organization