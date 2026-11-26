<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Site](https://github.com/wry-red/site) Astro theme by wry-red, copied from commit `e55ae592184c5695e2bc1d41b39636c42c9c3b2d` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-site.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with bun, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - Added .nvmrc with Node 24, the Node version Wasmer builds with.
- **Environment variables:** None.
- **Credit:** theme by [wry-red](https://github.com/wry-red), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# 📄 wry.red

![wry.red](https://wry.red/og.png)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GitHub](https://img.shields.io/github/license/wry-red/site?color=%232F3741&style=for-the-badge)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white&style=for-the-badge)](https://conventionalcommits.org)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

Welcome! This is the site of [wry](https://wry.red).

The code and design are directly derived from [Sat Naing](https://satnaing.dev) 👨🏻‍💻's fantastic [astro-paper](https://github.com/satnaing/astro-paper). Project structure like client scripting, full-text search, route generation are heavily modified to suit personal taste.

This theme is written in vanilla TypeScript for SSG and a sprinkling of client-side JavaScript and libraries to add some interactions for a better experience when navigating the site. TailwindCSS is used for styling and Markdown for blog content. While not thoroughly tested, the site works mostly fine with JavaScript disabled.

## 📊 PageSpeed Insights

![PageSpeed Insights](./psi.svg)

## 🔥 Features

- [x] type-safe markdown
- [x] progressive enhencement
- [x] accessible (Keyboard/VoiceOver)
- [x] responsive (mobile ~ desktops)
- [x] SEO-friendly
- [x] light & dark mode
- [x] full-text search
- [x] draft posts & pagination
- [x] sitemap & rss feed
- [x] dynamic OG image generation for blog posts

## 🚀 Project Structure

```bash
/
├── public/
│   └── favicon.ico
│   └── toggle-theme.js
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   │   |  blog/
│   │   |    └── some-blog-posts.md
│   │   └── config.ts
│   ├── icons/
│   ├── layouts/
│   └── pages/
│   └── styles/
│   └── utils/
│   └── config.ts
│   └── env.d.ts
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

All blog posts are stored in `src/content/blog` directory.

## 💻 Tech Stack

- **Main Framework**: [Astro](https://astro.build/)
- **Type Checking**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Full-Text Search**: [Pagefind](https://pagefind.app/)
- **Icons**: [Tablers](https://tabler-icons.io/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Linting**: [ESLint](https://eslint.org)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 👨🏻‍💻 Running Locally

The easiest way to run this project locally is to run the following command in your desired directory.

```bash
bun create astro --template wry-red/site
```

## 🔑 Google Site Verification (optional)

You can easily add your [Google Site Verification HTML tag](https://support.google.com/webmasters/answer/9008080#meta_tag_verification&zippy=%2Chtml-tag) in your site using environment variable. This step is optional. If you don't add the following env variable, the google-site-verification tag won't appear in the html `<head>` section.

```bash
# in your environment variable file (.env)
PUBLIC_GOOGLE_SITE_VERIFICATION=<your-google-site-verification-value>
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

> **_Note!_** For `Docker` commands we must have it [installed](https://docs.docker.com/engine/install/) in your machine.

| Command                              | Action                                                                                                                           |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `bun install`                        | Installs dependencies                                                                                                            |
| `bun run dev`                        | Starts local dev server at `localhost:4321`                                                                                      |
| `bun run check`                      | Check code typing                                                                                                                |
| `bun run build`                      | Build your production site to `./dist/`                                                                                          |
| `bun run preview`                    | Preview your build locally, before deploying                                                                                     |
| `bun run format:check`               | Check code format with Prettier                                                                                                  |
| `bun run format`                     | Format codes with Prettier                                                                                                       |
| `bun run sync`                       | Generates TypeScript types for all Astro modules. [Learn more](https://docs.astro.build/en/reference/cli-reference/#astro-sync). |
| `bun run commit`                     | Commit code changes with commitizen                                                                                              |
| `bun run lint`                       | Lint with ESLint                                                                                                                 |
| `docker compose up -d`               | Run Astro on docker, You can access with the same hostname and port informed on `dev` command.                                   |
| `docker compose run app bun install` | You can run any command above into the docker container.                                                                         |

> **_Warning!_** Windows PowerShell users may need to install the [concurrently package](https://www.npmjs.com/package/concurrently) if they want to [run diagnostics](https://docs.astro.build/en/reference/cli-reference/#astro-check) during development (`astro check --watch & astro dev`).

## ✨ Feedback & Suggestions

If you have any suggestions/feedback, feel free to open an issue if you find bugs or want to request new features.

## 📜 License

Licensed under the MIT License, Copyright © 2023

---

Made with ❤️ by [wry](https://wry.red), Derived from [Sat Naing](https://satnaing.dev) 👨🏻‍💻's fantastic [astro-paper](https://github.com/satnaing/astro-paper).
