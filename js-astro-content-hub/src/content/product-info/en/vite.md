---
tagline: "Next generation frontend tooling. A dev server that feels instant, and a build that feels effortless."
description: "A fast, modern frontend build tool with instant dev server and optimized production builds."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Category"
    value: "Build Tool"
features:
  - title: "Native ESM dev server"
    body: "No bundling during dev. The server starts in milliseconds and scales with your project size."
    icon:
      paths:
        - "M4 17l6-6 4 4 6-6M14 9h6v6"
  - title: "Instant HMR"
    body: "Hot module replacement over native ESM, so edits are reflected before you switch windows."
    icon:
      paths:
        - "M13 2L4.5 12.5H11L9.5 22 19 10.5H12.5L13 2z"
  - title: "Optimized build"
    body: "Rollup-powered production builds with smart code splitting and asset handling out of the box."
    icon:
      paths:
        - "M3 17l6-6 4 4 8-8M14 7h7v7"
  - title: "Framework agnostic"
    body: "First-class templates for React, Vue, Svelte, and more, plus a flexible plugin API."
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"
install: |
  npm create vite@latest
links:
  - label: "Website"
    href: "https://vite.dev"
# Section system demo: the vite landing now runs through the same section
# registry as every other product (previously a hand-written override).
sections:
  - type: hero
  - type: highlights
    data:
      variant: badge
  - type: install
  - type: features
    data:
      layout: bento
      eyebrow: "Why Vite"
      title: "Built for developer experience"
  - type: stats
    data:
      eyebrow: "By the numbers"
      title: "Adopted by the ecosystem"
      items:
        - { label: "GitHub Stars", value: "70k" }
        - { label: "npm weekly downloads", value: "8M" }
        - { label: "License", value: "MIT" }
  - type: docs-preview
  - type: cta
    data:
      primary: { label: "Get Started", href: "/vite/docs/getting-started" }
      secondary: { label: "View Source", href: "https://github.com/vitejs/vite" }
---

Vite is a build tool that aims to provide a faster and leaner development
experience for modern web projects. It uses native ES modules during dev for
an instant dev server, and pre-bundles dependencies for production with
Rollup.
