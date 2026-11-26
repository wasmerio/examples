# onepage · one file is your homepage

> Edit one YAML file and you have a personal homepage on your own address

**English** · [简体中文](README.md)

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE) [![365 Open Source Plan #022](https://img.shields.io/badge/365%20Open%20Source%20Plan-%23022-1f6feb)](https://github.com/rockbenben/365opensource)

**[▶ See a finished one](https://me.newzone.top/)** · **[⬆ Use this template](https://github.com/rockbenben/onepage/generate)** — a few clicks in the browser and the page is yours

Read.cv shut down. Bento shut down. A homepage hosted on someone else's platform can vanish any time. onepage's answer: **one YAML file + a static site + your own address**, and every asset belongs to you.

**Pick a path:**

- **Not technical at all** → follow "Path 1". Everything happens in the browser — no software to install, no command line, not even a domain to buy.
- **Developer / want a local preview** → follow "Path 2".

## Path 1 · No terminal, browser only (recommended for non-developers)

1. **Copy the template**: click the green **"Use this template" → "Create a new repository"** at the top of this page. For **Repository name** enter **`your-github-username.github.io`** — if your username is `lisa`, enter `lisa.github.io`. Your address then becomes `https://lisa.github.io` — free, memorable, and no domain purchase.
2. **Fill in your own content and save**: open the new repo, click **`src/data/projects.yaml`**, hit the ✏️ pencil icon, and replace the name, intro, and works with yours. Scroll to the bottom and click the green **"Commit changes"**.
   > Tip: **only change the text after the colon `:` — never touch the leading spaces (indentation).** YAML aligns by indentation, and one missing space turns the page blank. When in doubt, edit text only and don't add new lines. The only required field is `名字` (name) — delete any other line you don't want.
   > If your English page (`/en/`) still shows someone else's title and intro: the repo ships with a translation file, `src/data/projects.en.yaml` — see "Make it yours" below for what to do with it.
   > **Don't want to hand-edit YAML?** Once deployed, open `your-username.github.io/edit` — fill in a form, then "Download projects.yaml" or copy it back into step 2. A form can't break your indentation, so no white screen.
   > The editor UI has a 中 / EN toggle (top-right); it defaults from the main file's `语言` (lang) and remembers your choice.
3. **Turn the page on**: after the first save, wait 1–2 minutes (the repo builds in the background and creates a `gh-pages` branch). Then go to **Settings → Pages**, set **Source** to **"Deploy from a branch"**, pick the **`gh-pages`** branch and **`/ (root)`** folder, and click Save. (One-time setup.)
4. **Open your homepage**: wait another 1–2 minutes, then visit `your-username.github.io`.
5. **To change anything later**: edit the same file again — saving redeploys automatically.

> Want the preview image and title to be right when someone shares your link? Set `网址` (url) in `src/data/projects.yaml` to your address (`https://your-username.github.io`) — everything else follows it automatically. If the page is just for you and share previews don't matter, skip it.

## Path 2 · Local preview / advanced (needs Node + a terminal)

```bash
npm install
npm run fetch     # fetch star counts / avatar / og thumbnails (optional)
npm run dev       # http://localhost:4321 — save projects.yaml and it hot-reloads
npm run build     # fetch + build → dist/
```

## Features

- **The only required field is `名字` (name)**: a minimal 6-line file already builds a complete page; every other field simply doesn't exist until you add it
- **Field names in Chinese or English**: `名字/name`, `作品/works`, `重点/star`… write either, both are recognized
- **Layout is automatic**: a work marked `重点` (star) becomes a large card with an image, works sharing a `分类` (group) get a subheading, `数据` (stats) become a numbers strip — every layout decision lives in the renderer, not your config
- **Manual first, automatic as fallback**: thumbnails, avatar, and star counts can all be set by hand; leave them out and the build fetches them (og:image from the linked page, GitHub API), **optimizes** them (resize to card size + WebP, ~80% lighter), and caches them locally
- **Zero JS, zero external requests**: Astro 5 + Tailwind 4, pure static output, fonts and images all self-hosted (the `/edit` page aside)
- **GitHub features are optional**: put a GitHub URL in your links and star counts and the avatar update themselves; leave it out and the build still works
- **A second language is optional**: drop in a `src/data/projects.<code>.yaml` translation file and the site gains that language version plus a header switcher; delete the file and it goes offline

## YAML reference

The whole file is flat — one level, no nested sections. The only required field is `名字` (name); everything else is optional.

### Minimal example (6 lines → a live site)

```yaml
名字: Jane
介绍: One line on who you are and what you do.
作品:
  - 名字: My first project
    介绍: What it does.
    链接: https://example.com
```

### Top-level fields

| Chinese key | English alias | Required | Notes |
| --- | --- | --- | --- |
| 名字 | name | **yes** | your name — the only required field |
| 头衔 | title | | one-line title; a verifiable fact works better than a slogan |
| 介绍 | intro | | one-line intro |
| 头像 | avatar | | local path (put the image under `public/`, e.g. `/avatar.jpg`) or a URL; if omitted and your links include GitHub, the GitHub avatar is fetched |
| 链接 | links | | a list, each `- label: url`; the icon is inferred from the URL, or from a label like "博客/blog" (GitHub / X / email / RSS / blog…) |
| 作品 | works | | a list, each entry per the table below |
| 数据 | stats | | a list, each `- label: value`; auto values: `自动`/`auto` = total stars, `项目数`/`repos` = public non-fork/archived repo count, `forks` = total forks (all need a GitHub entry under 链接/links, else skipped); rounded down to the nearest ten with a `+` at build |
| 网址 | url | | the site's public address, used for share previews (og) and canonical; skipped entirely if absent |
| 颜色 | color | | site-wide accent color, e.g. `"#c8402e"` — **the quotes are required**: without them YAML treats everything after `#` as a comment (the hover shade is derived automatically) |
| 主题 | theme | | the whole palette, one of `cinnabar` (default) / `indigo` / `pine` / `sepia` / `mono`; omit for cinnabar |
| 外观 | appearance | | light or dark, `light` (default) / `dark` / `auto` (follows the visitor's system dark mode, pure CSS) |
| 开源项目 | opensource | | optional, a number = auto-list GitHub repos with ≥ that many stars as an "Open Source" section; `true` = default 10; omit = hidden |
| 开源项目起始 | opensource_since | | optional, a date (e.g. `2026-03`); repos created after this date are all listed (bypassing the star threshold) |
| 星标线 | star_line | | optional, the Open Source sort split (default 30): repos above it pin to the top by stars; the rest sort by most-recent update, where an update means the newest **non-bot commit** on the default branch (see below). It doubles as the cut-off for "Open source max" — repos above it always show |
| 开源上限 | opensource_max | | optional, caps **only the tail below the star line** (e.g. `15`; `0` = high-star repos only); the total rounds up to a multiple of 3 to fill the last row of the 3-column grid; high-star repos above it always show; omit = list all |
| 开源排除 | opensource_exclude | | optional, a list of repo names (`- repo`) to keep out of the Open Source section (e.g. this template repo itself, empty shells); accepts a bare repo name or a full GitHub URL; case-insensitive |
| 开源命名 | opensource_names | | optional, a `repo: display name` map (e.g. `md-translator: MD Translator`); changes only the display name in the Open Source section; thumbnails/links still use the original repo; omit = use the GitHub name |
| 开源描述 | opensource_descriptions | | optional, a `repo: description` map that overrides the GitHub-fetched description in the Open Source section; **translatable** — put the English in `projects.en.yaml`'s field of the same name, so each language shows its own; omit = use the GitHub description |
| 页脚 | footer | | footer sign-off; `<a>` links allowed |
| 标记 | mark | | small mark at the top-left (e.g. `365 · Open Source`) with a cinnabar seal dot; omit = hidden |
| 语言 | lang | | UI wording language, defaults to Chinese; see "Languages" |

### Work entry fields

| Chinese key | English alias | Required | Notes |
| --- | --- | --- | --- |
| 名字 | name | **yes** | the work's name |
| 介绍 | intro | | one-line description |
| 链接 | link | | any URL: GitHub / article / video / arXiv / App Store… (omitting it is fine — an image-only work just isn't clickable) |
| 源码 | source | | a second link (a repo alongside a live demo, code alongside a paper) |
| 图 | image | | manual thumbnail (local path or URL); if omitted it's fetched automatically: your repo's **custom Social preview** first, then the link page's og:image, then the GitHub auto-generated card |
| 日期 | date | | a string shown verbatim, e.g. `2020–2024` |
| 出处 | via | | where it was published, e.g. a magazine / YouTube / arXiv |
| 分类 | group | | works sharing a value are grouped under a subheading; omit to fall into the default "Works" group |
| 重点 | star | | `true` → shown as a large card with an image, and not repeated in the list below |

> The page order is fixed and laid out for you: **avatar · name · title · intro → link buttons → stats strip → featured cards → grouped lists → footer**. You supply the content; the renderer handles the layout.
>
> Zero-config fixups: a link written as a bare email (`hi@example.com`) gets `mailto:` prepended, a bare domain (`example.com`) gets `https://`.

### Open source (auto)

Set `opensource: 10` and the build auto-lists your GitHub repos with ≥ 10 stars as an "Open Source" section (repos above the star line pin to the top by stars, the rest sort by most-recent update; forks/archived excluded, deduped against featured/manual works — no hand-copying). Each row carries a **source** link, plus a **demo/store** link when the repo has a homepage.

Add `opensource_since: 2026-03` and every repo created after that date is listed too (regardless of stars) — for showing breadth when you ship a lot.

Repos you don't want on the page (empty shells, experiments, this template itself) go in `开源排除`:

```yaml
开源排除:
  - onepage
  - js-opencc
  - https://github.com/rockbenben/docs-tools-by-ai   # bare repo name or full URL both work
```

> **How "most-recent update" is computed**: the newest **non-bot commit on the default branch**. GitHub's `pushed_at` records "last write to any ref" — a CI run, a branch delete, a release all bump it to today. Measured on one repo with a busy CI, `pushed_at` ran 14 days ahead of its last human commit. Sorting "what am I still working on" by that hands your activity score to automation, so the build looks the human commit time up separately (one batched GraphQL query, no extra per-repo requests). If it can't be fetched (no token / query fails) it falls back to `pushed_at` and behaves exactly as before.

> **How many get shown**: everything above the `星标线` (star line) always shows — those are your headline repos and shouldn't be cut off; `开源上限` only trims the long tail below the line (most-recently-updated first). So 8 above the line + a limit of 15 = 23, rounded up to **24** cards — the grid is 3 columns, and padding it keeps the last row full (if candidates run out, you get however many there are). Set it once and forget it: when the high-star group grows, it can never push your best repos out; whatever gets trimmed is covered by the "See more on GitHub" link at the end.

> Auto-listed repo **names and descriptions come straight from GitHub and aren't translated per language** (the English page shows the GitHub text as-is). To rename or translate one, hand-write it into `作品`/`works` instead (it's deduped against the auto list).
>
> If you only want prettier repo names (`md-translator` → `MD Translator`, `scrcpy-helper` → `scrcpy 投屏助手`), use the `开源命名`/`opensource_names` map instead of hand-writing the whole work:
>
> ```yaml
> opensource_names:
>   md-translator: MD Translator
>   scrcpy-helper: scrcpy 投屏助手
> ```
>
> To rewrite the Open Source descriptions in your own words and **per language** (GitHub descriptions are often bilingual), use `开源描述`/`opensource_descriptions` — Chinese in the main file, English in `projects.en.yaml`:
>
> ```yaml
> # projects.yaml
> opensource_descriptions:
>   md-translator: 翻译 Markdown 不破坏格式，代码块、LaTeX、链接全保留。
> # projects.en.yaml
> opensource_descriptions:
>   md-translator: Translate Markdown without breaking format — code, LaTeX, links preserved.
> ```

### Three usage recipes

**1 · Work history / timeline** — no new fields; group with `分类` and show the span with `日期`:

```yaml
作品:
  - 名字: Senior Engineer · Some Co.
    介绍: Led XXX from zero to one.
    日期: 2022–present
    分类: Experience
  - 名字: Engineer · Another Co.
    介绍: Owned the YYY module.
    日期: 2020–2022
    分类: Experience
```

**2 · Legal / registration notice in the footer** — `页脚` accepts `<a>`, so notices belong here (one line):

```yaml
页脚: '<a href="https://example.gov/" target="_blank" rel="noopener">Registration No. 00000000</a>'
```

**3 · Photo / design wall** — mark every work `重点` so they all become image cards in a grid; image-only works can drop `链接`:

```yaml
名字: Someone
头衔: Photographer
作品:
  - 名字: Morning Fog
    图: /photos/1.jpg
    重点: true
  - 名字: Street Corner
    图: /photos/2.jpg
    重点: true
```

### Not into writing code?

A complete working config for a writer / researcher / photographer lives in `tests/fixtures/writer.yaml` — no GitHub fields at all; `重点` (cards) + `分类` (grouped lists) + `数据` (stats) are enough to make a site.

## Themes

Change one line — `theme:` — to switch the whole palette. Five presets:

| Theme | Character |
| --- | --- |
| cinnabar (default) | Paper-white · ink · cinnabar, warm editorial red |
| indigo | Calm and professional |
| pine | Natural, grounded |
| sepia | Warm paper, for writers |
| mono | Near-monochrome minimal, for designers |

Each ships light + dark. **`appearance: light` is the default**; `appearance: dark` pins dark, or `appearance: auto` follows the visitor's system dark mode (pure CSS, still zero-JS). Theme and appearance are fixed in the config — there's no on-page toggle (change these two lines, or use `/edit`). A `color:` value still overrides the current theme's accent.

```yaml
theme: indigo
appearance: dark
```

## Make it yours

- `src/data/projects.yaml` — all of your content (the repo ships with the author's own portfolio as an example; edit it directly)
- **The domain changes in one place**: set `网址` (url) in `projects.yaml`; `astro.config.mjs` follows it automatically (Path 1 users put `username.github.io`)
- `src/data/projects.en.yaml` — the repo's built-in English translation (the author's own title, intro, and sign-off), used to demo a bilingual site. It's an "original → translation" map that overrides the matching text directly — so even after you replace `projects.yaml` with your own content, the English page still shows this file's text. **Don't want an English version? Just delete this file.** Want one? Replace its contents with your own translation
- `public/favicon.svg` — site icon
- `public/og.png` — social share image
- `LICENSE` — MIT; put your own name in it

## Deploying elsewhere

GitHub Pages (Path 1) is the zero-config default. Alternatives:

- **Cloudflare Pages**: connect the repo, build command `npm run build`, output directory `dist`, and add a `GITHUB_TOKEN` env var (**strongly recommended** — not just for rate limits: GraphQL requires auth, and without it "most-recent update" falls back to `pushed_at`, so repos bumped by CI or branch deletions outrank genuinely active work, and thumbnails fall back to per-repo page fetches).

> `public/shots/` and `public/avatar-auto.*` are generated at build time and are git-ignored — you don't need to (and shouldn't) commit them.

## Languages

### UI wording (10 languages)

The template's own fixed wording — "Featured", "Works", "Try it", "Source", "Back to home", the 404 page — follows `语言` (lang):

```yaml
语言: en   # switch the UI to English; names like 中文 / 英文 / 日语 are recognized too
```

**10 languages** are built in: `en` `zh-CN` `zh-TW` `ja` `ko` `es` `fr` `de` `pt` `ru`. Variants like `zh-Hans` / `zh-Hant` are recognized too; anything unlisted falls back to English. To add one: open `src/i18n/ui.ts`, copy a block and translate it.

### Serving your site in a second language (optional)

**Drop in a `src/data/projects.<code>.yaml` to publish that language; delete the file to take it offline.** A plain-link language switcher appears in the header (no JavaScript). The repo **already ships** `src/data/projects.en.yaml` (the author's own English translation) — replace its contents with your own, or delete it if you don't need it.

A translation file is not a full config — it's an "original → translation" map. **Keys are the originals from the main file.** Order doesn't matter, you needn't fill it all in, and anything left out falls back to the main file:

```yaml
# projects.en.yaml
头衔: Independent developer
介绍: Building AiShort and a 30+ project OSS matrix.
页脚: Project #022 of 365 Open Source

作品:                 # key = the work's 名字 (name) in the main file
  AiShort:
    介绍: AI prompt community with 18 UI languages.
  千世书 Thousand Lives:
    名字: Thousand Lives
    介绍: An AI text game, fully client-side.

文字:                 # loose originals → translations: group names, stat labels, link labels
  开源项目: Open-source projects
  联系我: Contact
```

Rules:

- **Translatable**: top-level `头衔` `介绍` `页脚`; a work's `名字` `介绍` `出处`; the `文字` dictionary covers group names, stat labels, and link labels.
- **Not translatable** (always from the main file): `链接` `源码` `图` `日期` `重点` and other structural fields — structure lives in exactly one place, so the two never drift apart.
- The code in the filename is the language: `projects.ja.yaml` → `/ja/`. Three files, three languages.
- A key that matches nothing (you edited a name but not the translation) prints a build warning naming the key; the build still succeeds.
- If two works share a name in the main file, a warning fires and the translation applies to the first one only.

## OG share image

`public/og.png` is the social share card. Edit `scripts/og-template.html` and screenshot it at 1200×630, or just drop in your own image.

## About the 365 Open Source Plan

Project **#022** of the [365 Open Source Plan](https://github.com/rockbenben/365opensource) — one person + AI, 300+ open-source projects in a year. [Submit your idea →](https://365.aishort.top/) · [Discord](https://discord.gg/PZTQfJ4GjX) · [Telegram](https://t.me/aishort_top)
