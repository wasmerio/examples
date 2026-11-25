---
title: Using Components
description: Learn how to use and customize components in your documentation.
sidebar:
  order: 1
---

Dockit provides multiple component options for building rich, interactive documentation. You have access to both Astro Starlight's built-in components and a collection of custom premade components.

## Astro Starlight Components

You can use all the powerful components that come with Astro Starlight framework. These include cards, badges, code blocks, tabs, and many other useful documentation elements.

For complete documentation and usage examples of all available Starlight components, visit:
**[https://starlight.astro.build/components/using-components/](https://starlight.astro.build/components/using-components/)**

## Dockit Premade Components

In addition to Starlight components, Dockit includes a collection of custom-built components designed specifically for documentation needs. All these components are located in the `user-components` folder.

### Available Custom Components

The following premade components are available for use in your documentation:

- **[Accordion](./accordion)** - Collapsible content sections for organizing information
- **[Button](./button)** - Customizable button elements with various styles
- **[Grid](./grid)** - Flexible grid layout system for organizing content
- **[ListCard](./list-card)** - Card-based lists for showcasing features or items
- **[NewCard](./new-card)** - Enhanced card component with modern styling

Each component has its own detailed documentation page with usage examples, props, and best practices.


## Component Location

All custom components are organized in the following structure:

```
src/
  components/
    user-components/     ← Main custom components
      ├── Accordion.astro
      ├── Button.astro
      ├── Grid.astro
      ├── ListCard.astro
      └── NewCard.astro

```

## Getting Started

- **For Starlight components**: Refer to the official Starlight documentation linked above
- **For custom components**: Each component in the `user-components` folder can be imported and used directly in your MDX files
- **Component customization**: All components can be modified to fit your specific design needs

Choose the components that best fit your documentation requirements and create engaging, interactive content for your users.