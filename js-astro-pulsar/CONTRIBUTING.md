# Contributing to Astro Pulsar

Thank you for your interest in contributing to Astro Pulsar! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then clone your fork
   git clone https://github.com/YOUR_USERNAME/astro-pulsar.git
   cd astro-pulsar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Project Structure

```
/
├── src/
│   ├── components/     # Reusable Astro components
│   ├── content/        # Blog posts and content collections
│   ├── layouts/        # Page layouts
│   ├── pages/          # Route pages
│   └── config.ts       # Site configuration
├── public/             # Static assets
├── dist/               # Build output (generated)
└── tests/              # Test files (if applicable)
```

### Making Changes

1. **Keep changes focused**: Each PR should address a single feature or bug fix
2. **Test your changes**: Ensure everything works before submitting
3. **Update documentation**: If you change functionality, update relevant docs
4. **Follow existing patterns**: Match the coding style of the existing codebase

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for clear and structured commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (whitespace, formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or correcting tests
- **chore**: Changes to build process or auxiliary tools

### Scopes (optional)

- `component`: Component-related changes
- `style`: Styling changes
- `seo`: SEO-related changes
- `config`: Configuration changes
- `deps`: Dependency updates

### Examples

```bash
# Feature
git commit -m "feat(component): add newsletter subscription form"

# Bug fix
git commit -m "fix(dark-mode): resolve toggle state persistence issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Performance
git commit -m "perf(images): optimize image loading with lazy loading"

# Breaking change
git commit -m "feat(config)!: restructure site configuration
BREAKING CHANGE: SITE_CONFIG structure has changed, see migration guide"
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run checks**
   ```bash
   npm run build  # Ensure build passes
   ```

3. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Use a [conventional commit](https://www.conventionalcommits.org/) title (e.g. `feat: add search`, `fix: header overlap`) — PRs are squash-merged and the title becomes the changelog entry
   - Follow the PR template if provided
   - Reference any related issues (#123)
   - Include screenshots for UI changes
   - Describe what you changed and why

5. **PR Review**
   - Address feedback promptly
   - Keep the conversation constructive
   - Update your PR based on review comments

6. **After Merge**
   - The feature branch is deleted automatically on GitHub; delete your local copy
   - Pull the latest main branch

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for type safety
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Prefer `const` over `let`, avoid `var`

### Astro Components

- Use `.astro` extension for Astro components
- Keep components focused and reusable
- Use props for component configuration
- Add TypeScript types for props

### CSS/Tailwind

- Use Tailwind utility classes primarily
- Follow the existing dark mode pattern (`dark:` prefix)
- Keep custom CSS minimal
- Use semantic class names when needed

### File Organization

- Place components in `src/components/`
- Place pages in `src/pages/`
- Place layouts in `src/layouts/`
- Keep static assets in `public/`

## Testing

Before submitting a PR:

1. **Manual Testing**
   - Test in development: `npm run dev`
   - Test production build: `npm run build && npm run preview`
   - Test in multiple browsers (Chrome, Firefox, Safari)
   - Test responsive design (mobile, tablet, desktop)
   - Test dark mode toggle

2. **Build Verification**
   ```bash
   npm run build  # Should complete without errors
   ```

3. **Type Checking**
   ```bash
   npx astro check  # Should pass without errors
   ```

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

Version bumps are automated using `standard-version` based on commit messages.

## Questions?

If you have questions or need help:

- Open an issue with the `question` label
- Check existing issues for similar questions
- Review the [README.md](README.md) for general information

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Astro Pulsar! 🚀✨
