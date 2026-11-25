---
title: Accordion Component
description: A collapsible content component for organizing information in expandable sections.
sidebar:
  order: 6
---

The Accordion component creates collapsible content sections that help organize information in a space-efficient way. Users can click on the header to expand or collapse the content.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | No | Data attribute for styling or JavaScript targeting |
| `question` | string | Yes | The header text displayed in the accordion |
| `answer` | string/HTML | Yes | The content displayed when accordion is expanded |

## Features

- **Interactive Toggle** - Click to expand/collapse content
- **Icon Animation** - Plus icon rotates when toggled
- **Responsive Design** - Works on all screen sizes
- **Custom Styling** - Supports theme customization
- **Accessible** - Keyboard navigation support

## Usage Examples

### Basic Accordion
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  question="What is Dockit?" 
  answer="Dockit is a modern documentation theme built with Astro and Starlight." 
/>
```

### Accordion with Type
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  type="faq"
  question="How do I customize the theme?" 
  answer="You can customize colors, fonts, and layout through the configuration files." 
/>
```

### Multiple Accordions
```mdx
import Accordion from "../../../../components/user-components/Accordion.astro";

<Accordion 
  question="Installation" 
  answer="Run npm install to get started with Dockit." 
/>

<Accordion 
  question="Configuration" 
  answer="Edit the astro.config.mjs file to customize your site." 
/>

<Accordion 
  question="Deployment" 
  answer="Deploy to Netlify, Vercel, or any static hosting provider." 
/>
```

## Styling

The component includes built-in styles with support for:
- Light and dark theme variants
- Hover and focus states
- Smooth animations
- Custom spacing and typography

## Best Practices

- Use clear, concise questions as headers
- Keep answer content focused and scannable
- Group related accordions together
- Use the `type` prop for consistent styling across similar accordions