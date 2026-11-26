# Contributing to Inkfolio

[English](CONTRIBUTING.md) · [简体中文](CONTRIBUTING.zh.md)

Thanks for taking the time to help. Inkfolio is a small theme with a narrow promise: an editorial Astro site that a non-developer can run by editing YAML. Most of the rules below come from that promise — they are not bureaucracy.

## Ways to help

- **Report a bug.** Open an issue with the page URL, what you expected, and what happened. A screenshot of the browser console or the broken layout saves a round trip.
- **Request a feature.** Say what you are trying to publish and why the current template gets in the way. If the answer is “one more config key”, say which file it would live in.
- **Improve the docs.** Confusing pages are bugs. Especially the per-key reference under `src/content/docs/reference/`: if a key behaves differently from what the page says, that is a bug too.
- **Translate.** Chinese entries live beside English ones; missing or stale translations are always accepted.
- **Send a pull request.** Keep it focused: one concern per PR.

Security issues have their own policy: see [SECURITY.md](SECURITY.md).

## Before you start

- **Open an issue first for anything visual.** Layout, typography, colours and motion are the substance of this theme, not decoration. A PR that redesigns a page without an agreed direction will be declined, not merged.
- **Check for an existing issue or PR.** Duplicates cost more time than they save.
- **Read the config surface.** If your change could be a config key instead of code, it should be a config key.

## Setup

Node 20+ (22 recommended). No global tooling is required — every command goes through the npm scripts.

```bash
git clone https://github.com/respectevery01/inkfolio.git
cd inkfolio
npm install
npm run dev          # http://localhost:4321
```

To work against your own domain instead of `example.com`:

```bash
SITE_URL="https://your-domain.test" npm run dev
```

## Requirements for a pull request

Run these before opening the PR; CI-level failures in review are the most common reason a PR stalls.

```bash
npm run lint         # ESLint
npm run format:check # Prettier, check only
npm run build        # astro check && astro build && pagefind
```

All three must pass. `npm run build` also verifies that the Pagefind index still builds, which is what `/search` depends on.

## House rules

These are the constraints that keep the theme coherent. A change that breaks one of them needs a discussion, not a workaround.

**Configuration first.** Anything a site owner might want to change belongs in `site.config.yaml` or `src/data/*.yaml`, with a sensible default. Code reads config; it does not hardcode site names, nav labels, colours, analytics IDs, or friend links.

**No client-side framework.** No React, Vue, Svelte or islands bundler — plain Astro plus a small amount of inline script where interaction genuinely needs it (search, theme toggle, consent, dialogs). If you need a library, it ships locally, not from a CDN.

**No third-party runtime requests.** Fonts, icons, analytics and images load from the site or not at all. This is why Font Awesome is bundled and why the OG images are rendered at build time.

**Analytics stays consent-gated.** GA4 and Clarity must not load before consent. Umami is the always-on, cookieless exception. Do not add a tracker that ignores this.

**Bilingual means both files, not machine translation.** `posts/foo.md` pairs with `posts-zh/foo.md`; docs, weekly and research follow the same shape. The language switcher only appears for real pairs, and `hreflang` only describes real pairs — never emit an alternate that 404s. Chinese copy should read like Chinese, not like a translation of English.

**Every new config key needs docs, in both languages.** Add the key to the per-key reference page in `src/content/docs/reference/site-config.md` and its counterpart under `src/content/docs-zh/reference/`. Undocumented keys are treated as unfinished work.

**Accessibility is part of the design.** Visible focus states, keyboard-operable menus and dialogs, `prefers-reduced-motion` respected, and body text that meets contrast in both themes. If you change a component, tab through it.

**Sample content stays desensitized.** The demo is public. Do not commit personal data, real analytics exports, client names, private repository names, tokens, or anything that cannot be shown to a stranger. Demo author is “Inkfolio”.

**Never commit secrets.** No `.env`, no tokens, no `wrangler.toml` with real account IDs. If you spot a leaked credential in history, report it instead of quietly deleting it.

## Style

- **Commits**: one sentence, plain language, describing what changed and why. No emoji, no conventional-commit prefixes.
- **TypeScript**: the project runs `astro check` in the build, so keep types honest rather than casting.
- **CSS**: tokens from the theme stylesheet; no magic hex values inside components.
- **Content**: posts follow the frontmatter documented in the README; use `toc: false` when a piece does not need a sidebar.
- **Comments**: only where the code cannot say it itself. Skip the narration.

## Review

Expect a review focused on three questions: does it fit the promise (config-driven, no framework), is it documented, and does it survive the build. Small PRs usually merge within a few days; large redesigns are more likely to be asked for an issue first.

## Licensing of contributions

Inkfolio is [GPL-3.0](./LICENSE). By opening a pull request you agree that your contribution is licensed under the same terms. There is no CLA and no copyright assignment.
