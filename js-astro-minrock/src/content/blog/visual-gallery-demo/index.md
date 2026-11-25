---
title: "Visual Gallery & Deep Zoom Demo"
description: "Exploring Minrock's native PhotoSwipe 5 lightbox integration with interactive diagrams, fluid pinch-to-zoom, and responsive galleries."
pubDate: 2026-09-16
tags: ["design", "showcase", "typography", "obsidian"]
draft: false
image: "/images/minrock-design-system.svg"
---

Welcome to the interactive visual gallery demo. In technical publications and architecture documentation, high-fidelity images, diagrams, and schematics require smooth, distraction-free inspection.

Minrock now integrates **PhotoSwipe 5** natively—giving your readers instant click-to-zoom, pinch gestures on mobile, mouse wheel zoom on desktop, and keyboard gallery navigation (`←` / `→` / `Esc`).

---

## Interactive Architecture Diagram

Click on the diagram below to open it in full-resolution zoom. Notice how SVG graphics automatically scale up to crisp 1920px rendering:

![Vault CMS and Minrock Architecture](/images/vaultcms-architecture.svg)

> **Pro Tip**: When PhotoSwipe opens, you can double-click or pinch to zoom deeper into fine-grained labels and connections.

---

## The Four Minrock Palettes

Our theme system offers four harmonious palettes crafted specifically for long-form reading comfort:

![Minrock Design System & Palettes](/images/minrock-design-system.svg)

### Key Features of the Lightbox

1. **Zero External Requests**: Built with PhotoSwipe 5 bundled directly into the static site assets.
2. **Gallery Mode**: If an article contains multiple images, opening one allows you to swipe or arrow through all of them seamlessly.
3. **Smart Aspect Ratio Handling**: Automatically calculates bounding boxes to avoid layout jumps during opening and closing animations.
4. **Accessible Keyboard Controls**: Full ARIA dialog compliance with focus trap and `Esc` to dismiss.

Enjoy testing the zoom experience across different viewports and devices!
