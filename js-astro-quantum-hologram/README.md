<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Quantum Hologram](https://github.com/smart-developer1791/astro-quantum-hologram) Astro theme by smart-developer1791, copied from commit `e2d1342f071f973c8b49dc176eaca3dd16d7e26e` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-quantum-hologram.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
- **Environment variables:** None.
- **Credit:** theme by [smart-developer1791](https://github.com/smart-developer1791), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<div align="center">

# 🌌 Quantum Hologram

**A breathtaking quantum interactive experience built with Astro, React, and Framer Motion.**

[![Astro](https://img.shields.io/badge/Astro-6.1.2-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Sitemap](https://img.shields.io/badge/SEO-Sitemap_Ready-67E8F9?style=for-the-badge)](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
[![Netlify](https://img.shields.io/badge/Netlify-Deploy-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br/>

*Experience the future of web interfaces with fluid animations, zero layout shifts, and blazing fast performance powered by Astro's static site generation and React's island interactivity.*

</div>

---

## ✨ Highlights

- **Bento Grid Architecture:** Beautiful interactive bento cards with a synchronized `useMotionValue` cursor spotlight effect.
- **The Singularity Engine:** A stunning visual representation of complex orbital geometries using synchronized CSS border radii and Framer Motion.
- **Infinite Tech Marquee:** Seamless, infinite, hardware-accelerated text scrolling for your tech stack or partners.
- **Fluid Animations:** Hardware-accelerated Framer Motion transitions that feel like liquid throughout the entire page.
- **Zero Layout Shift:** Stable UI that never jumps, ensuring a premium user experience.
- **Static Reliability:** Built strictly as an SSG, combining ultimate security with infinite scale.
- **Quantum State:** Advanced React state management isolated within Astro islands.

---

## 🧭 Pages

- `/` - Main landing page
- `/robots.txt` - Crawler rules generated dynamically
- `/sitemap-index.xml` - Auto-generated sitemap

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | Astro 6 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Interactivity | React, Framer Motion |
| SEO | `@astrojs/sitemap`, canonical metadata, robots.txt |
| Hosting | Static deployment ready (Netlify optimized) |

---

## 🚀 Local Development

### 📦 Install

```bash
npm install
```

### ▶️ Run dev server

```bash
npm run dev
```

### 🏗️ Build

```bash
npm run build
```

---

## 📁 Project Structure

```text
astro-quantum-hologram/
├── public/
│   ├── favicon.svg
│   ├── noise.svg
│   └── og.svg
├── src/
│   ├── components/
│   │   ├── BentoGrid.tsx
│   │   ├── Features.tsx
│   │   ├── Hero.tsx
│   │   ├── QuantumCore.tsx
│   │   └── TechMarquee.tsx
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   └── robots.txt.ts
│   └── styles/
│       └── global.css
├── .gitignore
├── astro.config.mjs
├── LICENSE
├── netlify.toml
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🌐 Deployment

### 🌐 Netlify (Recommended)

1. Push your code to GitHub
2. Connect repository to Netlify
3. Build settings are auto-configured via `netlify.toml`
4. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## 📄 License

MIT License. See `LICENSE`.
