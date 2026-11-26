---
title: 'Zahit Theme: Advanced Customization & Colors'
description: 'Step-by-step guide to modifying configuration variables, styling layout systems, and updating color themes.'
pubDate: '2026-05-23'
tags: ['zahit-guide', 'customization', 'css']
translationKey: 'zahit-customization'
---

Welcome to the Zahit advanced customization guide! Since Zahit is designed under pure minimalist aesthetics, the codebase is kept raw, transparent, and extremely easy to tweak. In this tutorial, we will show you how to update your biographical profile card, tweak key CSS properties inside the global design system, and customize the translation dictionaries.

---

## 👤 1. Editing Core Metadata: `src/config.ts`

To personalize your name, current role, short biography, and social links, open the file `src/config.ts`. This file exports three main configurations:

### SITE_CONFIG
Defines your global website parameters:
- `title`: Shown in browser tabs and page layout headers.
- `description`: Used for default SEO metadata description.
- `url`: The canonical root domain address where your blog is deployed.

### AUTHOR
Maintains your profile card data:
- `name`: Your full name.
- `role`: Localized roles for Turkish (`tr`) and English (`en`).
- `bio`: Localized short summaries rendered under your avatar image.
- `avatar`: Path to your profile picture (placed in `/public/`, e.g., `/profile.jpeg`).

### SOCIALS
A list of social accounts rendered as rounded floating icons in the desktop sidebar or mobile footer:
```typescript
export const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/johndoe',
    icon: 'mdi:github',
  },
  // Add more links using the same schema structure
];
```
*Note: Any Iconify code prefix (like `mdi:`) can be referenced to render custom SVGs automatically.*

---

## 🎨 2. Customizing Themes and Color Schemes

Zahit's design is fully controlled by CSS variables inside `src/styles/global.css`. You can completely restyle the theme color scheme and typography by editing the values defined inside the `:root` pseudo-selector:

```css
:root {
  /* Main Colors */
  --bg-color: #00022b;     /* Deep canvas background color */
  --dark: #010e54;         /* Accented panels & container backdrops */
  --accent: #0855b1;       /* Primary link text, borders, and buttons */
  --light: #4fa5d8;        /* Hover effects, dynamic titles & bright cues */
  --text-color: #daeaff;   /* Softer tinted shade ensuring text readability */

  /* Typography */
  --font-family-body: 'Source Sans 3', sans-serif;
  --font-family-heading: 'Source Sans 3', sans-serif;

  /* Layout Widths */
  --site-width: 80%;       /* Global responsiveness container width constraint */
  --content-padding: 2rem;
}
```

### Creating a Forest Green Theme:
For example, to transition the theme from a space-blue look into a dark forest theme, swap the color variables:
```css
:root {
  --bg-color: #0d1a0d;
  --dark: #1b331b;
  --accent: #2e662e;
  --light: #66cc66;
  --text-color: #e2f2e2;
}
```

---

## 🗣️ 3. Modifying Dict Translations: `src/i18n/ui.ts`

All the UI-related static text fragments (such as navigations, "Published on" text, or the "Contents" sidebar title) are stored inside the `src/i18n/ui.ts` file. 

To add or modify translation strings, look at the `ui` object:

```typescript
export const ui = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'toc.title': 'İçindekiler',
  },
  en: {
    'nav.home': 'Home',
    'toc.title': 'Contents',
  },
} as const;
```

Simply update the corresponding string values, or add new keys to adapt the dictionary according to your requirements.

---

## Conclusion

Zahit is built to remain out of your way and let your content shine. By leveraging the clean separation of `src/config.ts`, pure CSS tokens, and static dictionary keys, customizing your portfolio site is a matter of minutes.

Happy coding, and enjoy sharing your thoughts with the world!
