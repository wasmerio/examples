---
title: ListCard Component
description: A card component for displaying categorized content lists with icons and article counts.
sidebar:
  order: 3
---

The ListCard component creates attractive cards that display content categories with icons, titles, article counts, and optional featured images. Perfect for organizing documentation sections or feature lists.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | string | Yes | The main title displayed in the card header |
| `imageIcon` | string | Yes | Path to the icon image (40x40px recommended) |
| `number` | number | Yes | Number of articles or items in this category |
| `image` | string | No | Optional featured image for wide card layout |

## Features

- **Icon Display** - Shows category icons with proper alt text
- **Article Counter** - Displays the number of items in each category
- **Two Layout Modes** - Compact and wide layouts based on image presence
- **Responsive Design** - Adapts to different screen sizes
- **Slot Content** - Accepts custom content in the card body
- **Image Integration** - Uses ImageMod component for optimized images

## Usage Examples

### Basic ListCard
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<ListCard
  title="Getting Started"
  imageIcon="/sidebar-icons/Introduction.svg"
  number={5}
>
  Essential guides to help you get up and running quickly with Dockit.
</ListCard>
```

### ListCard with Featured Image
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<ListCard
  title="Components"
  imageIcon="/sidebar-icons/Themes.svg"
  number={12}
  image="/assets/components-preview.png"
>
  Learn how to use and customize all available components in your documentation.
</ListCard>
```

### Multiple ListCards in Grid
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";
import Grid from "../../../../components/user-components/Grid.astro";

<Grid columns={2}>
  <ListCard
    title="Configuration"
    imageIcon="/sidebar-icons/Global Settings.svg"
    number={8}
  >
    Customize your site settings, theme, and functionality.
  </ListCard>

  <ListCard
    title="Navigation"
    imageIcon="/sidebar-icons/Navigation.svg"
    number={6}
  >
    Set up menus, breadcrumbs, and site navigation.
  </ListCard>
</Grid>
```

### Featured Section with Image
```mdx
import ListCard from "../../../../components/user-components/ListCard.astro";

<ListCard
  title="Theme Customization"
  imageIcon="/sidebar-icons/Themes-gradient.svg"
  number={15}
  image="/assets/theme-demo.png"
>
  Complete guide to customizing colors, fonts, layouts, and creating your own theme variants. Includes live examples and code snippets.
</ListCard>
```

## Layout Modes

The ListCard automatically switches between two layout modes:

### Compact Mode (No Image)
- Single column layout
- Icon and title in header
- Content directly below
- Best for simple category listings

### Wide Mode (With Image)
- Two-column layout on larger screens  
- Content on left, image on right
- More visual prominence
- Perfect for featured sections

## Styling

The component includes comprehensive styling:
- Responsive grid layout when image is present
- Consistent spacing and typography
- Icon sizing (40x40px)
- Theme-aware styling
- Hover and focus states

## Image Requirements

- **Icons**: 40x40px recommended, SVG preferred
- **Featured Images**: Any size, component will handle responsive sizing
- **Alt Text**: Automatically generated from title prop
- **Optimization**: Uses ImageMod component for performance

## Best Practices

- Use consistent icon styles across related ListCards
- Keep titles concise and descriptive
- Update article numbers when content changes
- Use featured images sparingly for emphasis
- Group related ListCards together for better organization
- Ensure icons have good contrast and are clearly visible