<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Resume Theme](https://github.com/wasutz/astro-resume-theme) Astro theme by wasutz, copied from commit `b872ecaa60b550579a2f59568d177767391eda53` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-resume-wasutz.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [wasutz](https://github.com/wasutz), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro Resume Theme

Astro Resume Theme is a fully customizable and responsive template, built to help you create a beautiful online resume or portfolio with ease. It is powered by Astro and styled using Tailwind CSS, making it fast, modern, and easy to work with.

## Usage

You can bootstrap a new Astro project using the following command:

```bash
# Bun
bun create astro@latest --template wasutz/astro-resume-theme

# npm 7+
npm create astro@latest -- --template wasutz/astro-resume-theme

# pnpm
pnpm dlx create-astro --template wasutz/astro-resume-theme

# yarn
yarn create astro --template wasutz/astro-resume-theme
```

## 🚀 Features

- Tailwind CSS: Utilizes utility-first styling for rapid UI development.
- Dark Mode: Built-in dark mode toggle for better UX.
- Theme Customization: Easily adjustable in src/styles/theme.css.
- Responsive Design: Optimized for mobile, tablet, and desktop devices.
- MDX Support: Allows blog posts written in Markdown with JSX components.
- Excellent Lighthouse/PageSpeed scores
- SEO-friendly

## 🧞 Commands

All commands are run from the root of the project, from a terminal:
(Could be use 'npm' instead of bun)

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |

# Getting Started

1) Initialize the project
Run one of the commands listed in the Quick Start section.

2) Customize your resume data
Edit your resume data in `src/config/cv.json`

3) Customize theme colors
Modify the color scheme by editing `src/styles/theme.ts` to match your personal branding.

4) Replace your CV file
Put your cv file in `src/public/cv` and then replace the file name in `src/config/cv.json` (basic.cv_file_name)

5) Run the project locally
Once you’ve made your customizations, run the development server:

```
bun run dev
```

Open http://localhost:4321 in your browser to view the result 🚀

## License

Licensed under the MIT License, Copyright © Wasut Panyawiphat.

See [LICENSE](/LICENSE) for more information.