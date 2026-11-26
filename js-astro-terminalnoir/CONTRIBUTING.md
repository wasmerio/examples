# Contributing

## Checks

Node.js 22.22.0 or newer.

```sh
npm ci
npm test
npm run check
npm run format:check
npm run verify
```

`npm test` is Vitest. `npm run check` is `astro check`. `format:check` is Prettier with `prettier-plugin-astro`.
`verify` also runs the import scan and the browser matrix, which needs Playwright's Chromium:

```sh
npx playwright install chromium
```

## Secrets

Do not commit tokens, `.env` files, service accounts or cloud credentials. The CI workflow only reads the repository and
runs `npm run verify`. It does not deploy.
