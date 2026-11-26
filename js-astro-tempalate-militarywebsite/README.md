<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Vanguard Zen Military & Security Template](https://github.com/Zyrexnn/tempalate-militarywebsite) Astro theme by Zyrexnn, copied from commit `7014acb20582243e7705b1592c552e793eaa0f5c` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-tempalate-militarywebsite.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Resized 1 image over 300 KB to at most 1600 px wide, keeping file names and formats.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [Zyrexnn](https://github.com/Zyrexnn), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 🎖️ Astro Military Theme

A premium, dark-mode-ready Astro starter template designed for **military units, government agencies, and institutional organizations**. Features a tactical design system, bilingual i18n support, scroll-reveal animations, and a fully responsive layout.

![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🌓 Dark Mode** — Automatic detection + manual toggle with no flash
- **🌍 i18n (ID/EN)** — Built-in Indonesian & English translations with one-click toggle
- **🎯 Tactical Design System** — Military-inspired color palette, typography, and components
- **📱 Fully Responsive** — Mobile-first design optimized for all screen sizes
- **✨ Scroll Reveal Animations** — Fade, slide, and scale effects on scroll
- **🔍 SEO Ready** — Dynamic meta tags, Open Graph, and semantic HTML
- **📂 Centralized Data** — All content in `src/data/` for easy customization
- **⚡ Fast** — Static-first Astro architecture with zero JS by default

## 📁 Project Structure

```
├── public/
│   ├── camo-pattern.svg       # Background pattern
│   └── favicon.svg            # Site favicon
├── src/
│   ├── assets/                # Images (replace with your own)
│   ├── components/
│   │   ├── Card.astro         # Division/department card
│   │   ├── DarkModeToggle.astro
│   │   ├── Footer.astro
│   │   ├── Gallery.astro      # Photo gallery grid
│   │   ├── Hero.astro         # Landing hero section
│   │   ├── LangToggle.astro   # Language switcher
│   │   ├── Navbar.astro       # Sticky navigation
│   │   └── Timeline.astro     # Historical timeline
│   ├── data/
│   │   ├── siteConfig.ts      # ⭐ Site name, address, SEO
│   │   └── content.ts         # ⭐ All page content
│   ├── i18n/
│   │   └── translations.js    # ID/EN string translations
│   ├── layouts/
│   │   └── Layout.astro       # Base HTML layout
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── sejarah.astro      # History page
│   │   ├── struktur.astro     # Organization structure
│   │   └── galeri.astro       # Photo gallery
│   └── styles/
│       └── global.css         # Design system & animations
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/astro-military-theme.git
cd astro-military-theme

# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

## 🎨 Customization Guide

### Step 1: Update Site Config

Edit **`src/data/siteConfig.ts`** to set your organization's name, subtitle, motto, address, and SEO metadata:

```ts
export const siteConfig = {
  siteName: "Your Unit Name",
  siteSubtitle: "Your Subtitle",
  siteMotto: "Your Motto",
  siteDescription: "A brief description for SEO.",
  address: {
    line1: "Your City, Region",
    line2: "Your Country",
  },
  // ...
};
```

### Step 2: Replace Content

Edit **`src/data/content.ts`** to update:

- Hero section text
- Division/department cards (title, location, description)
- Timeline events (years, titles, descriptions)
- Gallery images
- History page chapters
- Statistics
- Commander/leader information

### Step 3: Replace Images

Replace the sample images in **`src/assets/`** with your own:

- Hero background image
- Organization logo
- Gallery photos
- History chapter photos

### Step 4: Update Translations

Edit **`src/i18n/translations.js`** to update all bilingual strings. Each key has an `id` (Indonesian) and `en` (English) value.

### Step 5: Customize Colors

Edit the CSS custom properties in **`src/styles/global.css`** under `@theme` (light mode) and `.dark` (dark mode):

```css
@theme {
  --color-primary: #4b5320; /* Main brand color */
  --color-secondary: #1c2526; /* Dark backgrounds */
  --color-accent: #b8860b; /* Highlights & accents */
  /* ... see global.css for all tokens */
}
```

### Step 6: Update Favicon

Replace `public/favicon.svg` and `public/favicon.ico` with your own icons.

## 🚢 Deployment

### Vercel

```bash
npm run build
# Then deploy the `dist/` folder
```

Or connect your GitHub repo to [Vercel](https://vercel.com) for automatic deployments.

### Netlify

```bash
npm run build
# Deploy the `dist/` folder
```

Or connect your GitHub repo to [Netlify](https://netlify.com) with:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## 🛠 Commands

| Command           | Action                               |
| :---------------- | :----------------------------------- |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Start dev server at `localhost:4321` |
| `npm run build`   | Build production site to `./dist/`   |
| `npm run preview` | Preview production build locally     |

## 📄 License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this template.

---

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
