# Contributing to Academic Pages Astro

Thank you for your interest in contributing to Academic Pages Astro! This guide will help you get started with development, testing, and submitting contributions.

---

## Development Workflow

### Prerequisites

- **Node.js**: `>= 22.11.0` (Node 22, 24, or 26+)
- **Package Manager**: `pnpm` (`npm install -g pnpm`)

### Local Setup

```bash
# 1. Clone your fork of the repository
git clone https://github.com/<your-username>/academicpages-astro.git
cd academicpages-astro

# 2. Install dependencies
pnpm install

# 3. Start local development server (with hot module reload)
pnpm dev
```

---

## Quality Gates & Verification

Before submitting a pull request, make sure all automated checks pass locally:

```bash
# 1. Format code with Prettier and Tailwind class sorter
pnpm format

# 2. Run code quality gate (lint, format check, TypeScript typecheck)
pnpm verify

# 3. Build static production site
pnpm build

# 4. Run automated Playwright browser tests
pnpm test
```

---

## Commit Guidelines

This project uses **Conventional Commits** to generate automated changelogs and release notes via `git-cliff`.

Format your commit messages as:

```text
<type>(<optional scope>): <description>
```

### Supported Types

- `feat`: A new feature or capability
- `fix`: A bug fix
- `docs`: Documentation updates
- `style`: Code style or formatting changes with no logic change
- `refactor`: Code refactoring without new features or bug fixes
- `perf`: A code change that improves performance
- `test`: Adding or updating test suites
- `chore`: Maintenance tasks, dependency updates, or configuration changes

---

## Pull Request Guidelines

1. Fork the repository and create your branch from `main`
2. Keep pull requests focused on a single topic, bug fix, or feature
3. Ensure the pull request title follows Conventional Commits format (e.g., `feat(sidebar): add Mastodon icon`)
4. Confirm `pnpm verify` and `pnpm test` pass with 0 errors
5. Do not open PRs back to this repository for personal website customizations or content changes
