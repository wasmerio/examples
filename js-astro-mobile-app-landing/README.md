<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Mobile App Landing](https://github.com/sofiyevsr/mobile-app-landing-template) Astro theme by sofiyevsr, copied from commit `87b904e3c44d53a15ecfb59d263a76fff2bba1bc` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-mobile-app-landing.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [sofiyevsr](https://github.com/sofiyevsr), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Mobile App Landing Page Template

This project is a customizable landing page template for mobile apps, built with Astro, React, TypeScript, TailwindCSS, and DaisyUI. It offers seamless theme support using all the available themes from DaisyUI and can be easily tailored to fit your needs.

## Features
- Built with Astro & React: Combines the power of Astro for static rendering with the flexibility of React for interactive components.
- Built with TypeScript: Ensures a more robust codebase with type-checking capabilities.
- TailwindCSS & DaisyUI: Provides an easy-to-customize, responsive design, supporting all DaisyUI themes for quick and consistent styling.
- Responsive Layout: Mobile-first approach with full responsiveness for all devices.
- Customizable Sections: Includes pre-designed sections for partners, features, testimonials, and more. Sections can be reordered or modified easily.

## Prerequisites
Ensure you have the following installed:

- Node.js (v20 or higher recommended)
- pnpm

## Installation
```bash
pnpm i
```

## Local Development
```bash
pnpm dev
```

## Building for Production
```bash
pnpm build
```

This will generate a dist folder containing the optimized production build.

## Customization
If you just want to get your site up and running quickly, you probably don't need to modify the code directly, all you need to change is src/utils/config.ts. It probably includes all configuration you need.

## Theme
You can change the theme from src/utils/config.ts too. See all available themes [here](https://daisyui.com/docs/themes/).

## Used assets

### Fonts
- [CabinSketch](https://fonts.google.com/specimen/Cabin+Sketch)
- [Rowdies](https://fonts.google.com/specimen/Rowdies)

### Iphone frames
- [Iphone 15](https://www.figma.com/community/file/1385659531316001292)

### Avatars
- [Pexels](https://pexels.com)

### Icons
- [Swirl arrows, company logos](https://uxwing.com)
- [Wreath icon](https://freesvg.org)

### Misc
- [3D icons](https://3dicons.co)

### SVG Blobs
- [SVG Generator](https://fffuel.co)

### Screenshots
- [App screenshots](https://www.figma.com/community/file/874598319834758320)
