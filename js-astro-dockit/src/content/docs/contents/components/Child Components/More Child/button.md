---
title: Button Component
description: A simple, customizable button component with multiple style variants.
sidebar:
  order: 5
---

The Button component provides a clean, accessible button element that can be styled with different variants to match your design needs.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | string | Yes | The text displayed on the button |
| `link` | string | Yes | The URL the button should link to |
| `variant` | string | No | Style variant (primary, secondary, outline, etc.) |

## Features

- **Multiple Variants** - Different visual styles for various use cases
- **Accessible Links** - Properly structured anchor elements
- **Responsive Design** - Adapts to different screen sizes
- **Custom Styling** - Easy to extend with additional CSS classes
- **Semantic HTML** - Uses proper link elements for navigation

## Usage Examples

### Primary Button
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="Get Started" 
  link="/getting-started" 
  variant="primary" 
/>
```

### Secondary Button
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="Learn More" 
  link="/docs" 
  variant="secondary" 
/>
```

### Outline Button
```mdx
import Button from "../../../../components/user-components/Button.astro";

<Button 
  label="View Source" 
  link="https://github.com/your-repo" 
  variant="outline" 
/>
```

### Multiple Buttons
```mdx
import Button from "../../../../components/user-components/Button.astro";

<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
  <Button 
    label="Download" 
    link="/download" 
    variant="primary" 
  />
  <Button 
    label="Documentation" 
    link="/docs" 
    variant="secondary" 
  />
  <Button 
    label="GitHub" 
    link="https://github.com/your-repo" 
    variant="outline" 
  />
</div>
```

## Available Variants

The component supports various button styles through the `variant` prop:

- **primary** - Main call-to-action styling
- **secondary** - Secondary action styling  
- **outline** - Outlined button style
- **ghost** - Minimal styling with hover effects
- **danger** - For destructive or warning actions

## Styling

Buttons inherit styling from the theme's button CSS classes:
- `.btn` - Base button styles
- `.btn-primary` - Primary variant styles
- `.btn-secondary` - Secondary variant styles
- `.btn-outline` - Outline variant styles

## Best Practices

- Use clear, action-oriented labels
- Choose appropriate variants based on button importance
- Ensure sufficient color contrast for accessibility
- Test button functionality across different devices
- Use external links for external URLs and internal links for site navigation