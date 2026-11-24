---
title: "Dark Mode Done Right"
date: 2026-02-12
tags: ["design", "css", "web"]
description: "Flash-free dark mode with CSS custom properties and system preference detection."
---


Dark mode reduces eye strain, saves battery on OLED screens, and respects user preferences. But implementing it wrong creates a flash of the wrong theme on load.

## The flash problem

Most implementations set the theme with JavaScript after the page renders. Brief flash of the wrong theme.

## The solution

Run a tiny inline script in the `<head>`, before any content renders:

```javascript
(function() {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.dataset.theme = saved;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
```

No flash. The `<noscript>` tag provides a CSS-only fallback for users with JavaScript disabled.

