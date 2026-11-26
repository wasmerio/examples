---
tagline: "The web framework for content-driven websites — zero JavaScript by default."
description: "Astro builds fast, content-driven sites like blogs, marketing pages, and documentation with islands of interactivity."
highlights:
  - label: "License"
    value: "MIT"
  - label: "Runtime"
    value: "Node"
features:
  - title: "Zero JS by default"
    body: "Pages ship as pure HTML with no JavaScript by default — islands add interactivity only where needed."
    icon:
      paths:
        - "M13 2L4.5 12.5H11L9.5 22 19 10.5H12.5L13 2z"
  - title: "Content collections"
    body: "Typed Markdown with schema validation, for docs, blogs, and more, out of the box."
    image:
      fallback: "MD"
      gradient: "linear-gradient(135deg, #2a9d8f 0%, #1f7a6f 100%)"
  - title: "Framework agnostic"
    body: "Bring your own UI framework — React, Vue, Svelte, and more — per component."
    icon:
      paths:
        - "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5"
links:
  - label: "Website"
    href: "https://astro.build"
# Section system demo (Phase 4): rich landing for the astro product so every
# product page in the hub has a consistent, content-driven landing.
sections:
  - type: hero
  - type: highlights
    data:
      variant: card
      eyebrow: "Core facts"
      title: "Open source, batteries included"
  - type: install
  - type: features
    data:
      layout: grid
      eyebrow: "Why Astro"
      title: "Built for content, not config"
  - type: stats
    data:
      - { label: "GitHub Stars", value: "48k" }
      - { label: "npm weekly downloads", value: "900k" }
      - { label: "License", value: "MIT" }
  - type: testimonials
    data:
      - quote: "Astro made our docs site noticeably faster with almost no effort."
        author: "Priya Sharma"
        role: "Platform Engineer"
        company: "Atlas"
        rating: 5
        avatar:
          fallback: "PS"
      - quote: "Content collections are the reason we moved our blog over."
        author: "Tom Nguyen"
        role: "Founder"
        company: "Dune"
        rating: 5
        avatar:
          fallback: "TN"
      - quote: "Zero JS by default is a genuinely different way to think about shipping."
        author: "Sofia Reyes"
        role: "Frontend Lead"
        company: "Halcyon"
        rating: 4
        avatar:
          fallback: "SR"
  - type: docs-preview
  - type: faq
    data:
      - q: "Does Astro ship JavaScript by default?"
        a: "No — pages are pure HTML by default; interactive islands opt in."
      - q: "Can I use my favorite framework?"
        a: "Yes — React, Vue, Svelte, Preact, and more are supported per component."
  - type: cta
    data:
      primary: { label: "Get Started", href: "/astro/docs/getting-started" }
      secondary: { label: "View Source", href: "https://github.com/withastro/astro" }
---

Astro is the web framework for content-driven websites: blogs, marketing
sites, and documentation. It ships **zero JavaScript by default**, so pages
are fast by construction, and adds interactive islands only where you need
them.
