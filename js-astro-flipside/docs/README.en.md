<div align="center">
  <h1>Flipside</h1>
  <p>
    <a href="https://github.com/nagameTW/astro-flipside/actions/workflows/ci.yml"><img src="https://github.com/nagameTW/astro-flipside/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="../LICENSE"><img src="https://img.shields.io/github/license/nagameTW/astro-flipside?style=flat-square&logo=opensourceinitiative&logoColor=white&color=3DA639" alt="License"></a>
    <img src="https://img.shields.io/badge/Astro-7-BC52EE?style=flat-square&logo=astro&logoColor=white" alt="Astro 7">
  </p>
  <p><a href="../README.md">繁體中文</a> | <a href="README.en.md">English</a></p>
</div>

Flipside is an [Astro](https://astro.build/) template for a personal web page and blog. The page has two faces, Work and Life. A visitor flips between them to see one person from two sides.

The interface language is zh-TW by default. English is also available. The layout handles zh-TW text well. The output is static files. It has posts, projects, a photo gallery, tags, RSS and full-text search built in. You can deploy it to GitHub Pages, Vercel and other hosts. The template grew out of the author's own website. The demo content is fictional. See the [live demo](https://astro-flipside.vercel.app/).

It also uses these packages:

- [Tocas UI](https://tocas-ui.com/): a UI framework designed for zh-TW text
- [Expressive Code](https://expressive-code.com/): code blocks
- [Pagefind](https://pagefind.app/): static full-text search

<p align="center">
  <img src="hero.jpg" width="720" alt="Flipside at a glance: the Work and Life faces, gallery, post list, code blocks, and the dark theme">
</p>

<details>
  <summary>Lighthouse score on mobile</summary>
  <p align="center">
    <a href="https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fastro-flipside.vercel.app%2F&form_factor=mobile">
      <img width="720" alt="Lighthouse scores on mobile: Performance, Accessibility, Best Practices, and SEO all 100" src="lighthouse-score.svg">
    </a>
  </p>
</details>

## Requirements

- Node.js 22.12 or newer

## Quick start

**1. Create your repo**

Select **Use this template** at the top of the GitHub page, or run:

```bash
gh repo create my-flipside --template nagameTW/astro-flipside --public --clone
```

**2. Run it locally**

```bash
cd my-flipside
npm install
npm run dev     # opens http://localhost:4321 and reloads when you save
```

**3. Set your URL**

Edit the first two fields at the top of `src/config.ts`. In `site`, write your URL, for example `https://<user>.github.io`. In `base`, write the repo sub-path. If the repo is named `<user>.github.io`, leave `base` as an empty string.

```ts
base: "/my-flipside",
```

**4. Turn on GitHub Pages**

Open **Settings → Pages** in the repo. Set **Source** to **GitHub Actions**. You do this one time.

**5. Deploy**

```bash
git add -A
git commit -m "first deploy"
git push        # Actions builds and deploys. It is live in about a minute.
```

Every push to `main` deploys again. If the page has no styles or images, check `base`.

## Documents

- [About Flipside](about.en.md): the idea behind it
- [Adding content](adding-content.en.md): posts, projects, photos
- [Deploy](deploy.en.md): GitHub Pages and Vercel settings, other hosts
- [CONTRIBUTING.md](../CONTRIBUTING.md): development setup and conventions

## Commands

Run these in the project root:

| Command           | Action                                                              |
| :---------------- | :------------------------------------------------------------------ |
| `npm run dev`     | Starts the local dev server at `localhost:4321`                     |
| `npm run build`   | Builds the release output to `dist/`, then indexes it with Pagefind |
| `npm run preview` | Previews the release build locally                                  |
| `npm run check`   | Type-checks the project                                             |
| `npm test`        | Runs the unit tests in `plugins/*.test.mjs`                         |
| `npm run fmt`     | Formats the code with Prettier                                      |

## Interface language

The default is `"zh-TW"`. For English, set `locale` to `"en"` in `src/config.ts`. The string dictionaries are in `src/locales/`. To add a language, copy the keys of `en.ts` and fill in the translations.

## Repository structure

```
├── src/
│   ├── components/    # Astro components: Navbar, Footer, FaceToggle, blocks/, ...
│   ├── content/blog/  # ← blog posts (.md / .mdx)
│   ├── data/          # ← About and Life copy, gallery, projects, trophies
│   ├── layouts/       # Layout.astro, BlogPost.astro
│   ├── locales/       # en.ts and zh-TW.ts UI string dictionaries
│   ├── pages/         # Routes: home, about, blog, tags, gallery, projects, RSS
│   ├── styles/        # global.css
│   ├── utils/         # Posts, timeline, URL and dialog helpers
│   └── config.ts      # ← the one source of settings
├── plugins/           # Build-time remark and rehype plugins, with unit tests
├── docs/
│   ├── about.en.md           # About Flipside
│   ├── adding-content.en.md  # Add posts, projects, photos
│   ├── deploy.en.md          # Deploy settings
│   ├── *.md                  # zh-TW versions of the documents
│   └── README.en.md          # This file
├── CONTRIBUTING.md    # How to contribute
└── SECURITY.md        # Security policy
```

The arrows mark what you edit to set up a new website.

## Contributing

Issues and PRs are welcome. Use the [issue forms](../../../issues/new/choose) for bug reports and feature requests. Open a PR for a small fix. For a larger change, open an issue first to agree on the direction. See [CONTRIBUTING.md](../CONTRIBUTING.md).

## License

[MIT](../LICENSE)

## Acknowledgments

Built on [Tocas UI](https://tocas-ui.com/). The blog scaffolding follows the official Astro blog starter.
