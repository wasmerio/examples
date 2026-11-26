<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Florin](https://github.com/tarasenko-by/florin) Astro theme by tarasenko-by, copied from commit `7f568a3f79da8994231df5f00cd079285e7cfe68` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-florin.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with npm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [tarasenko-by](https://github.com/tarasenko-by), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Florin — free fintech dashboard template

**Florin** is a free, open-source **fintech / banking dashboard template**: 16 polished screens, live theme switching, dark mode, and zero UI-framework lock-in. Built with [Astro](https://astro.build) and [Veritheme](https://veritheme.com) — a pure-CSS design system with design tokens and a vanilla-JS behaviour bundle.

![Florin overview — light](.github/assets/overview-light.png)

## Live re-theming

Every screen restyles itself instantly — brand color and dark mode — by switching a single `data-theme` attribute. No rebuild, no CSS-in-JS. The floating palette toolbar in the corner does it live: **Blue** is Veritheme's default theme, **Mint** is Florin's own theme, derived from one brand color.

| Mint theme | Mint · dark |
| --- | --- |
| ![Analytics — Mint theme](.github/assets/analytics-mint.png) | ![Cards — Mint dark](.github/assets/cards-mint-dark.png) |

![Florin overview — dark](.github/assets/overview-dark.png)

## Screens

**Banking:** Overview · Transactions · Accounts · Cards · Analytics
**Money:** Transfer · Payments · Savings
**Account:** Settings · Billing · Notifications · Help center
**Auth & errors:** Login · Sign up · Reset password · 404

All screens share one responsive app shell (collapsible sidebar → off-canvas drawer on mobile), realistic data, working modals, filters, and charts — no dead buttons.

## Quick start

```bash
git clone https://github.com/tarasenko-by/florin.git
cd florin
npm install
npm run dev
```

Open `http://localhost:4321` — you land on the Overview screen.

```bash
npm run build     # static build to dist/
npm run preview   # serve the production build
```

## How it's built

- **[Astro](https://astro.build)** — every screen is a static `.astro` page; zero client-side framework.
- **[Veritheme](https://github.com/tarasenko-by/veritheme)** 1.2 — styling comes from the published npm package (`veritheme`): components, utility classes and design tokens. What the library does not ship lives in Florin itself: [`florin.css`](src/styles/florin.css) for the app shell (edge sidebar, off-canvas drawer, menu placement, tinted icon tiles) and short `<style>` blocks in the few screens and components that need them (the bank card, the charts). All of it uses Veritheme's tokens — no hardcoded colors.
- **Theming** — [`florin-themes.css`](src/styles/florin-themes.css) holds Florin's Mint theme, generated from one brand color by Veritheme's `derive_theme` tool; themes switch via `data-theme`. Dark mode is a `.dark` class that follows the OS until the visitor picks explicitly.
- **Icons** — [Lucide](https://lucide.dev) via `@lucide/astro`.

## Use it as a starting point

Fork it, swap the fake data for your API, and keep the shell. Because styling is plain CSS classes on plain HTML, porting a screen to React, Vue, Svelte, or a server-rendered stack is copy-paste — there are no framework components to translate.

Want your own brand? Generate a theme in [Veritheme Studio](https://veritheme.com/studio/), add its CSS next to `florin-themes.css` and a button to the toolbar's theme list in `FlorinLayout.astro`, and every screen follows.

## License

[MIT](LICENSE) — free for personal and commercial use.

---

Made by [Siarhei Tarasenka](https://github.com/tarasenko-by) · powered by [Veritheme](https://veritheme.com)
