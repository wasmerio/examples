# Contributing

Thanks for your interest in contributing to astro-whoami.

## Setup

```bash
git clone https://github.com/asivura/astro-whoami.git
cd astro-whoami
npm install
npm run dev
```

## Development Workflow

Branch protection is enabled on `main`. All changes require pull requests.

```bash
git checkout -b <type>/<short-description>
# make changes
git add <files>
git commit -m "<type>: <description>"
git push -u origin HEAD
gh pr create --fill
```

Wait for CI checks to pass before merging. Rebase onto `main` if it has changed.

## Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/), enforced by [commitlint](https://commitlint.js.org/).

### Format

```text
<type>[optional scope]: <description>
```

### Types

| Type       | Purpose                         |
| ---------- | ------------------------------- |
| `feat`     | New feature                     |
| `fix`      | Bug fix                         |
| `docs`     | Documentation only              |
| `style`    | Formatting, no code change      |
| `refactor` | Code change, no new feature/fix |
| `perf`     | Performance improvement         |
| `test`     | Adding/correcting tests         |
| `build`    | Build system, dependencies      |
| `ci`       | CI configuration                |
| `chore`    | Maintenance tasks               |
| `revert`   | Reverting previous commit       |

### Rules

- Use imperative mood: "add" not "added"
- Don't capitalize first letter after type
- No period at the end
- Subject line: max 72 characters
- Breaking changes: add `!` after type (e.g., `feat!:`)

### Branch Naming

```text
<type>/<short-description>
```

Examples: `feat/add-rss`, `fix/nav-links`, `docs/update-readme`

## Code Conventions

- Pure Astro components only (no React/Vue/Svelte)
- Markdown for content (no MDX)
- Semantic HTML5 throughout
- JSON-LD structured data on every page type
- Keep changes focused: one feature or fix per PR

## Pre-commit Hooks

[Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) run automatically on commit:

- **ESLint** on `.astro`, `.ts`, `.js` files
- **Prettier** on all supported files
- **markdownlint** on `.md` files
- **commitlint** validates the commit message

## CI Checks

Pull requests run three checks:

| Check      | What it does                         |
| ---------- | ------------------------------------ |
| lint       | ESLint + Prettier + Astro type check |
| validate   | Semantic PR title check              |
| lighthouse | Lighthouse CI on all pages           |

### Lighthouse Thresholds

| Category       | Threshold | Level |
| -------------- | --------- | ----- |
| Performance    | 90        | warn  |
| Accessibility  | 100       | error |
| Best Practices | 100       | error |
| SEO            | 100       | error |

## Linting Commands

| Command                | Action                    |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start dev server          |
| `npm run build`        | Production build          |
| `npm run lint`         | ESLint                    |
| `npm run format`       | Auto-format with Prettier |
| `npm run format:check` | Check formatting          |
| `npm run check`        | Astro type check          |
| `npm run lint:md`      | markdownlint              |
