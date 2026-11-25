# Contributing to maucariapacom-church-starter

First off, thank you for considering contributing to the MauCariApa.com Church Starter template! We welcome contributions from the community to make this template even better for church websites PDPN.

Whether you're fixing a bug, improving documentation, adding a new feature, or suggesting an enhancement, your help is appreciated.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements or New Features](#suggesting-enhancements-or-new-features)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/TypeScript Styleguide](#javascripttypescript-styleguide)
  - [Astro Component Styleguide](#astro-component-styleguide)
  - [Tailwind CSS Usage](#tailwind-css-usage)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [License](#license)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to info@maucariapa.com.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/MauCariApa-com/maucariapacom-church-starter/issues).

If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/MauCariApa-com/maucariapacom-church-starter/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

Provide information about your environment:
- Astro version
- Node.js version
- Browser(s) and version(s)
- Operating system

### Suggesting Enhancements or New Features

We love to hear new ideas to improve this template!
1. Search [Issues](https://github.com/MauCariApa-com/maucariapacom-church-starter/issues) to see if the enhancement has already been suggested.
2. If not, [open a new issue](https://github.com/MauCariApa-com/maucariapacom-church-starter/issues/new) to start a discussion about your idea. Please provide a clear description of the enhancement and why it would be beneficial.

### Pull Requests

We welcome pull requests for bug fixes, documentation improvements, and new features that have been discussed and agreed upon in an issue.

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure your code lints (if a linter is configured).
5. Make sure your commit messages are clear and follow our [Git Commit Messages](#git-commit-messages) style.
6. Issue that pull request!

## Development Setup

To get the project конку up and running locally, follow the instructions in our [README.md](README.md#getting-started).

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.
- Consider using [Conventional Commits](https://www.conventionalcommits.org/) format for more structured commit messages, e.g.:
  - `feat: Add new sermon filtering option`
  - `fix: Correct an issue with event date display`
  - `docs: Update README with deployment instructions`
  - `style: Improve responsive layout on staff page`
  - `refactor: Restructure UI components for better reusability`
  - `test: Add unit tests for utility functions`
  - `chore: Update dependencies`

### JavaScript/TypeScript Styleguide

- Follow a consistent coding style. If a linter (like ESLint or Prettier) is set up, aemnu by its rules.
- Use modern JavaScript (ES6+) features where appropriate.
- For TypeScript, ensure type safety and use types effectively.

### Astro Component Styleguide

- Keep components focused and reusable.
- Use clear and descriptive prop names.
- Comment complex logic where necessary.
- Follow Astro's best practices for component structure and data fetching.

### Tailwind CSS Usage

- Utilize Tailwind's utility classes as much as possible.
- Add custom CSS глобаль in `src/assets/styles/global.css` only when a utility class is not sufficient or for very specific global styles.
- Keep `tailwind.config.cjs` organized and extend the theme там when necessary.

## Submitting a Pull Request

Before you submit your pull request,
* Ensure your changes are well-tested.
* Update the README.md or other relevant documentation if your changes require it.
* Make sure your branch is up-to-date with the `main` branch of `MauCariApa-com/maucariapacom-church-starter`.
* You may (and are encouraged to) squash your commits into a single, well-worded commit message before submitting.

Once you're ready, submit your pull request to the `main` branch. One of the maintainers will review your PR and provide feedback or merge it.

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](LICENSE). *(Ensure you have a `LICENSE` file, typically MIT for open-source starters)*
