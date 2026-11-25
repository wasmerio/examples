<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Projects Portfolio](https://github.com/masoudsoleymani/projects-portfolio-template) Astro theme by masoudsoleymani, copied from commit `2ec3ca88b09ad1b3d1e75610785bb4b9babbeadc` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-projects-portfolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [masoudsoleymani](https://github.com/masoudsoleymani), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Projects Portfolio Template

A responsive Astro starter portfolio template designed to be easy to customize as a reusable template.

![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features
- **Centralized Data:** All content in `/data/` for easy customization
- **Built-in Themes**: Choose a costum theme color palettes from a single config file.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop.
- **Performance:** Optimized for perfect Lighthouse scores.
- **SEO Ready:** Open Graph and semantic HTML
- **Fast** — Static-first architecture

## 🚀 Getting Started
Make sure you have **Node.js** v22.12.0 or higher installed on your machine.

1. Click **Use this template** on this repository.
2. Choose **Create a new repository**.
3. Clone your new repository: `git clone <your-repo-url>`
4. Navigate to your repo: `cd <your-repo-name>`
5. Install dependencies: `npm install`
6. Start development server: `npm run dev`
7. Update your content in `/data`
8. Deploy on your preferred platform

### Replace Content

Edit **`data/site.ts`** to update:

- Hero section texts
- About section texts
- experience cards content 
- Archive projects page content
- Contact links

### Replace Images

Replace the sample images in **`/public`** with your own:

- Featured projects cards images
- Favicon/logo

### 🎨 Theme Switching
This template comes with multiple built-in color palettes. To change the theme of your portfolio, 
open `src/config.ts` and update the `baseTheme` variable to one of the available options:
`'default', 'strategic', 'innovator', 'executive'`

## 📁 Project Structure
```
├── public/              # Static assets
├── data/                # jsON files for project data
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Layout templates with Meta tags
│   ├── pages/           # Site routes (index.astro)
│   └── styles/          # global css styles
│   └── config.ts        # Global site configuration
├── astro.config.mjs     # Astro configuration
└── tsconfig.json        # Typescript configuration
```

## 🛠 Commands 

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🤝 Contributions
Please read the [Contributing Guide](CONTRIBUTING.md) before opening a PR.

## 📝 License
This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute this template.
