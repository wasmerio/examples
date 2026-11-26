<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Estrocom](https://github.com/VBproDev/estrocom) Astro theme by VBproDev, copied from commit `853888504fb0bdbdc8bc684d11f0dbc7796bcb08` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-estrocom.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [VBproDev](https://github.com/VBproDev), AGPL-3.0. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<h1 align="center">Estrocom</h1>

<p align="center"> <img src="https://img.shields.io/badge/Astro-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro" /> <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Accessibility-005A9C?style=for-the-badge&logo=w3c&logoColor=white" alt="WCAG" /> </p>

Estrocom is a production ready e-commerce template built for responsiveness, SEO, WCAG accessibility, and high-performance. The demo showcases a functioning store for foxnut and roasted gram flour, but it can be adapted for any product.

<div align="center"><a href="https://estrocom.netlify.app">View live demo</a></div>

## Proven Performance, Accessibility & Responsiveness
 You don't need to take our word for it.

### Accessibility (WCAG-focused)
- 0 accessibility issues detected by Axe
- WCAG AA color contrast maintained in each page
- Tested using axe DevTools with best practices enabled

![axe accessibility report – 0 issues](https://iili.io/fG19k3g.webp)

### Performance
- Sub-1s load time
- Excellent Lighthouse scores across performance metrics

![Lighthouse performance report](https://iili.io/fG1Jxef.webp)

### Mobile-first & Responsive
- Designed mobile-first
- Fully responsive across breakpoints

<p align="center">
  <img src="https://iili.io/fG1dWuf.webp" alt="Mobile-first responsive homepage" width="300" />
</p>

---

## Key Features

- JSON-LD Schema and automatic sitemap: Your products get indexed and look great in Google search results.

- Full Shopping Flow: Integrated cart functionality and product categorization.

- Mobile-First: Works down to widths of 360px.

- Atomic Design: Scalable architecture using Atoms, Molecules, and Organisms.

## Getting Started
Ensure you have [Node](https://nodejs.org/en) and [Git](https://git-scm.com/) installed.

Cloning the repo
```
git clone https://github.com/VBproDev/estrocom.git
```

Installing and updating the dependencies-
```
npm install
npm update
```

# Customise

Estrocom is config driven by default.

1. **Add your products**  
   Edit `src/utils/productData.js` with your product details.  

2. **Replace images**  
   Swap the placeholders in `public/assets/` with your own images.  

3. **Update categories & product pages**  
   Edit the frontmatter in `src/pages/category/` and `src/pages/products/`.  

4. **Customize homepage**  
   Edit `src/pages/index.astro` to showcase your story.  

5. **Update theme colors**
   Edit `colors.js`, `sizing.js`, `typography.js` from `src/design-system` to reflect your branding.

6. **Add your domain**
   In `astro.config.mjs`, modify the `domain` variable to reflect your's site's root.

Want me to build it for you? [Email me](mailto:proshowspeed@gmail.com) and I’ll set up your store quickly.

---

## 💡 About Me

Hi! I’m Viraj Bijpuria, a developer specializing in modern, fast, and accessible e-commerce solutions. I help businesses launch online stores that look great, perform well, and attract customers.  

If you want a custom store built, or help setting up this template, I can handle everything from design to deployment, from SEO to a11y, from payment to delivery integrations.

[Contact me](mailto:proshowspeed@gmail.com) to get started.

---

## Project Structure

```
├── public/
│ ├── assets/ # All images used
│ └── favicon.svg
├── src/
│ ├── components/
│ │ ├── atoms
│ │ ├── molecules
│ │ └── organisms
│ ├── design-system/
│ ├── layouts/
│ ├── pages/
│ └── utils/
└── package.json
```


[Learn more about Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

---

## Commands

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies                             |
| `npm run dev`             | Start local server at `localhost:4321`          |
| `npm run build`           | Build production site in `./dist/`              |
| `npm run preview`         | Preview your production build locally           |
| `npm run astro ...`       | Run Astro CLI commands like `astro add` or `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |