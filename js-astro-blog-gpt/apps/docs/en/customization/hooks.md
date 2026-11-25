# Custom Hooks and Extensions

You can add custom web fonts, analytics, CSS overrides, and client-side behavior without editing the core theme. BlogGPT provides extension files inside the `custom/` folder at the root of your project.

## 1. Inject Custom `<head>` Tags (`custom/head.html`)

Anything you place inside `custom/head.html` is injected directly into the `<head>` of every page. The file is read as raw HTML; Astro frontmatter is not executed. This is the right place for:

- Third-party analytics (Umami, Plausible, Google Analytics, Cloudflare Web Analytics)
- Custom web fonts (`<link rel="stylesheet" href="...">`)
- Site ownership verification `<meta>` tags

```html
<!-- custom/head.html -->
<!-- Example: Umami Analytics -->
<script
  defer
  src="https://cloud.umami.is/script.js"
  data-website-id="your-website-id"
></script>
```

`custom/body-start.html` and `custom/body-end.html` also inject raw HTML at the start and end of `<body>`.

## 2. Override Styles and CSS Variables (`custom/styles.css`)

Use `custom/styles.css` to tweak theme colors, font families, spacing, or component styles. Because it loads after the core theme stylesheet, your rules take precedence cleanly:

```css
/* custom/styles.css */
body {
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

code,
pre {
  font-family: 'JetBrains Mono', monospace;
}

/* Customize dark mode accent or surface colors */
html[data-theme='dark'] {
  /* Your custom dark mode overrides */
}
```

## 3. Run Client Scripts Across Page Transitions (`custom/client.ts`)

BlogGPT uses client-side navigation so switching between posts feels instant and keeps the sidebar state intact. Because the browser doesn't perform a full page reload on every link click, standard `DOMContentLoaded` listeners only fire once on initial load.

To run custom JavaScript on **both** the initial page load and every subsequent client navigation, export an `onPageLoad` function from `custom/client.ts`:

```ts
// custom/client.ts
export function onPageLoad() {
  // Runs on initial load and after every client-side route change
  console.log('Navigated to:', window.location.pathname);

  // Example: Initialize a comment widget or custom interactive element
}
```
