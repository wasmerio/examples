# Contributing to Astro Content Hub

Thanks for your interest in contributing! This project welcomes two kinds of
contributions:

- **Content** - blog posts and product docs (Markdown).
- **Code** - the hub site itself (Astro components, i18n, build config).

Please read this file before opening a pull request. By participating, you
agree to abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Prerequisites

- **Node.js 22** (matches the deploy workflow). Use `npm`, not `pnpm`/`yarn`.
- A local clone of this repo.

## Local setup

```bash
git clone https://github.com/awareride/astro-content-hub.git
cd astro-content-hub
npm install
npm run dev      # local dev server
npm run build    # type check (astro check) + build to dist/
```

The build must pass with **0 errors, 0 warnings, 0 hints** before a change can
merge. Run it before you push.

## Contributing content

There are two ways to add content, depending on whether you are working inside
this hub repo or from a separate repository.

### 1. Author directly in the hub

Add Markdown under `src/content/`:

- **Posts:** `src/content/posts/<locale>/<slug>.md` -> `/posts/<slug>/`.
- **Docs:** `src/content/docs/<product>/<locale>/<slug>.md` ->
  `/<product>/docs/<slug>/`.

Frontmatter schemas, the slug contract, fallback behavior, and how to add a
product or locale are documented in
[Authoring content](./docs/en/authoring.md). The condensed authoring reference
for working inside a hub repo is in
[`skills/site-content/SKILL.md`](./skills/site-content/SKILL.md).

### 2. Sync content from a separate repository

External projects author `posts/` or `docs/` and sync them in via a GitHub
Action that opens a PR. Copy one of the
[`examples/`](./examples) repos, fill in the placeholders, and push. See
[Content sync](./docs/en/content-sync.md) for the full flow.

### Slug contract (critical)

A file's slug is its path relative to the locale dir, without `.md`.
**Filenames must be byte-identical across locales** so fallback works
(`en/foo.md` and `zh/foo.md` both have slug `foo`). Always write the `en`
version first. A local validator catches most mistakes:

```bash
node .agents/skills/awareride-content-sync/scripts/validate.mjs   # for synced content
```

## Contributing code

The hub is an Astro 7 static site with no UI framework and a single global
stylesheet. Conventions:

- **Keep components small and composable; prefer props over globals.**
- **`Layout.astro` owns the document shell** (`<html>/<head>/<body>`, fonts,
  meta, OG tags). Do not hand-write a second document shell.
- **Use the CSS custom properties** from
  [`src/styles/global.css`](./src/styles/global.css) (`--color-*`,
  `--radius-*`, `--shadow-*`, `--transition`) instead of hard-coded values.
- **TypeScript is `strict`** - do not introduce `any` without reason.
- **Prefer relative imports** for app code; the `@/*` alias maps to `src/*`.
- **Wrap rendered Markdown in `.prose`** so shared typography applies - do not
  write fresh scoped styles for Markdown output.

Architecture, routing, and the `src/lib/` module reference are documented in
[Architecture](./docs/en/architecture.md).

### Workflow

1. **Branch** off `main` for each change (`git checkout -b feat/my-change`).
2. **Make focused, reviewable changes** - prefer small PRs over large sweeps.
3. **Run the build** and confirm it passes:
   ```bash
   npm run build
   ```
4. **Spot-check** the affected route's output in `dist/` if behavior is
   uncertain.
5. **Open a pull request** against `main` and fill in the PR template.

### Commit messages

Use a short, imperative subject line, optionally prefixed with a type
(`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `ci:`). Reference an issue
in the body when relevant. Examples:

```
docs: add getting-started guide for mytool
fix: restore base path in canonical URLs
feat: add locale switcher to docs sidebar
```

### Branch protection and deployment

- `main` is **protected**. Never commit directly to it - always open a PR.
- The deploy workflow (`.github/workflows/deploy.yml`) is triggered
  **manually** (`workflow_dispatch`) and publishes `dist/` to GitHub Pages and
  Cloudflare Pages. It does not run automatically on push.

## Reporting issues

- **Bugs and feature requests:** open a
  [GitHub issue](https://github.com/awareride/astro-content-hub/issues) and
  pick the matching template.
- **Security vulnerabilities:** see [SECURITY.md](./SECURITY.md) - do not open
  a public issue for security reports.
- **General questions:** see [SUPPORT.md](./SUPPORT.md).

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](./LICENSE).
