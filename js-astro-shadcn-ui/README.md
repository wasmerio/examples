<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Astro Shadcn UI Template](https://github.com/AREA44/astro-shadcn-ui-template) Astro theme by AREA44, copied from commit `779ebe521c303702ac50ec6ac1f3be41a09c7ecd` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-shadcn-ui.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Removed files used only by other hosts: netlify.toml, vercel.json.
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [AREA44](https://github.com/AREA44), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astro shadcn/ui template

A modern starter template using [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/) - perfect for building fast, accessible, and themeable web apps.

---

## Getting Started

Before you begin, ensure that you have **Node.js** and **pnpm** installed.

### Setup

```bash
git clone https://github.com/area44/astro-shadcn-ui-template
cd astro-shadcn-ui-template
pnpm install
pnpm dev
```

Open your browser and go to [http://localhost:4321](http://localhost:4321) to see the app running.

## Adding Components

`shadcn/ui` provides pre-built, accessible UI components. To add one:

1. Follow the official [Astro installation guide](https://ui.shadcn.com/docs/installation/astro).
2. Pick a component (e.g., [Accordion](https://ui.shadcn.com/docs/components/accordion), [Dialog](https://ui.shadcn.com/docs/components/dialog)) and follow the usage instructions.

If you're new to using React (or other frameworks) inside Astro, start with the [Framework Components guide](https://docs.astro.build/en/guides/framework-components/).

## License

This project is licensed under the [MIT License](LICENSE).
