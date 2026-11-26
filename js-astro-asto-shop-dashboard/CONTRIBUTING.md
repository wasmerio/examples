# Contributing to AstoShop Dashboard

Thank you for helping improve AstoShop Dashboard. Contributions of all sizes are welcome, including bug fixes, documentation, accessibility improvements, new components, and feature proposals.

By participating, you agree to follow the project's [Code of Conduct](CODE_OF_CONDUCT.md).

## Before you start

1. Search existing issues and pull requests to avoid duplicate work.
2. Open an issue before starting a large feature or architectural change.
3. Keep each contribution focused on one problem.

## Local development

Fork the repository, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/AstoShop-dashboard.git
cd AstoShop-dashboard
npm install
npm run dev
```

Create a branch with a descriptive name:

```bash
git checkout -b feat/order-filters
```

Useful branch prefixes include `feat/`, `fix/`, `docs/`, and `refactor/`.

## Development guidelines

- Use TypeScript for application data, types, and interactive logic.
- Prefer Astro components for static UI and framework islands only when client-side interactivity is required.
- Reuse existing components before creating new ones.
- Keep components focused, typed, responsive, and keyboard accessible.
- Follow the existing naming and formatting conventions.
- Do not commit secrets, generated `dist/` files, or dependencies from `node_modules/`.
- Update documentation when behavior, setup, or public APIs change.

## Verify your changes

Before submitting a pull request, run:

```bash
npm run build
```

Also test the affected pages at mobile and desktop sizes. Check both light and dark themes when your changes affect appearance.

## Commit messages

Write concise, imperative commit messages. Conventional prefixes are encouraged:

```text
feat: add order status filters
fix: keep sidebar state after navigation
docs: document theme customization
```

## Pull requests

In your pull request:

- Explain what changed and why.
- Link the related issue when one exists.
- Include screenshots or a short recording for visible UI changes.
- Describe how you tested the change.
- Mention known limitations or follow-up work.

A maintainer may request changes before merging. Please keep review discussions respectful and resolve feedback with new commits rather than force-pushing while a review is active.

## Reporting bugs

Open a GitHub issue containing:

- A clear description of the problem
- Steps to reproduce it
- Expected and actual behavior
- Browser, operating system, and Node.js version
- Screenshots, logs, or a minimal reproduction when relevant

Do not include passwords, tokens, personal data, or other sensitive information in a public issue.

## Suggesting features

Describe the user problem first, then the proposed solution. Explain who benefits, include possible alternatives, and note any accessibility or performance implications.
