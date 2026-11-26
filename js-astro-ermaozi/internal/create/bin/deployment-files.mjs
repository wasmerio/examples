/** @type {Record<string, { install: string, build: string }>} */
const commands = {
  npm: { install: 'npm ci', build: 'npm run build' },
  pnpm: { install: 'pnpm install --frozen-lockfile', build: 'pnpm run build' },
  yarn: { install: 'yarn install --immutable', build: 'yarn build' },
}

/**
 * @param {string} deployment
 * @param {string} [packageManager]
 * @param {string} [firebaseProject]
 * @returns {Record<string, string>}
 */
export function deploymentFiles(deployment, packageManager = 'npm', firebaseProject = '') {
  const command = commands[packageManager] ?? commands.npm
  if (deployment === 'github-pages') return {
    '.github/workflows/deploy.yml': `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: withastro/action@v6
        env:
          SITE_ORIGIN: https://\${{ github.repository_owner }}.github.io
          BASE_PATH: \${{ endsWith(github.event.repository.name, '.github.io') && '/' || format('/{0}', github.event.repository.name) }}
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
`,
  }
  if (deployment === 'gitlab-pages') return {
    '.gitlab-ci.yml': `create-pages:
  image: node:24
  before_script:
    - corepack enable
    - export SITE_ORIGIN="$(node -p 'new URL(process.env.CI_PAGES_URL).origin')"
    - export BASE_PATH="$(node -p 'new URL(process.env.CI_PAGES_URL).pathname')"
    - ${command.install}
  script:
    - ${command.build}
  pages:
    publish: dist
  rules:
    - if: '$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH'
`,
  }
  if (deployment === 'netlify') return {
    'netlify.toml': `[build]
  command = "${command.build}"
  publish = "dist"
`,
  }
  if (deployment === 'vercel') return {
    'vercel.json': `${JSON.stringify({
      $schema: 'https://openapi.vercel.sh/vercel.json',
      framework: 'astro',
      outputDirectory: 'dist',
    }, null, 2)}\n`,
  }
  if (deployment === 'firebase') return {
    'firebase.json': `${JSON.stringify({ hosting: { public: 'dist', ignore: ['firebase.json', '**/.*', '**/node_modules/**'] } }, null, 2)}\n`,
    '.firebaserc': `${JSON.stringify({ projects: { default: firebaseProject || 'your-firebase-project-id' } }, null, 2)}\n`,
  }
  return {}
}
