---
title: Custom Configuration
categories: [Theme Introduction]
cover: /cover/2171616932c20231.avif
date: 2026-06-30 12:58:33
---

# Custom Configuration

## Method 1: Manual Editing

You can customize the theme configuration by modifying the `starread.config.ts` file in the root directory, including website title, navigation menu, author information, sidebar component display, etc.

Example configuration items:
```typescript
// Modify website title
site: {
  title: 'My Blog',
  // ...other configurations
}

// Custom navigation menu
nav: [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  // ...other menu items
]
```

## Method 2: GUI Editing

Use the `pnpm dev` command and find the configuration button in the navigation bar

> [!warning]
>
> For static resources such as images, please place the relevant files in the public directory

After adjusting the parameters, click Generate Configuration
