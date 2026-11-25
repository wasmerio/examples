# Installation

Get your Case portfolio up and running in minutes.

## Prerequisites

- [Node.js](https://nodejs.org/) v18.17.1 or higher
- npm, yarn, or pnpm

## Option 1: Create New Project (Recommended)

Best for starting a fresh portfolio with a clean git history.

```bash
npm create astro@latest -- --template erlandv/case
```

The CLI will guide you through setup:

1. **Where should we create your new project?** — Enter your project folder name (e.g., `my-portfolio`)
2. **Install dependencies?** — Select `Yes` to install dependencies
3. **Initialize a new git repository?** — Select `Yes` to initialize a new git repository

After completion, navigate to your project folder:

```bash
cd my-portfolio
```

## Option 2: Clone Repository

Best for contributing to the theme, theme development, or if you want to track upstream changes via git.

```bash
git clone https://github.com/erlandv/case.git my-portfolio
cd my-portfolio
npm install
```

**Note:** This preserves the original git history. To start fresh, delete the `.git` folder and run `git init`.

## Initial Setup

1. Copy the environment example file:

```bash
cp .env.example .env
```

2. Edit `.env` with your information:

```bash
# Required
SITE_URL=https://your-domain.com
SITE_AUTHOR_NAME="Your Name"
SITE_AUTHOR_TITLE="Your Job Title"
SITE_AUTHOR_EMAIL=you@example.com

# Optional
SITE_AUTHOR_BIO="Your professional bio"
SOCIAL_GITHUB=https://github.com/username
SOCIAL_LINKEDIN=https://linkedin.com/in/username
```

3. Start the development server:

```bash
npm run dev
```

Your site is now running at [http://localhost:4321](http://localhost:4321)

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run astro check` | Check for TypeScript errors |

## Next Steps

- [Quick Start Tutorial](./quick-start.md) — See real results in 5 minutes
- [Project Structure](./project-structure.md) — Understand the codebase
