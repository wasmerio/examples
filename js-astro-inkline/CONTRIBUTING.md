# Contributing

Thanks for helping. Inkline is deliberately small, so the most useful contributions are fixes, accessibility improvements, and documentation.

## Scope

Inkline stays minimal. A new feature is welcome if it:

- helps people read or write, and
- is off by default or can be removed by deleting a file, and
- adds little or no client-side JavaScript.

If you're unsure, open an issue before writing code.

## Setup

```sh
npm install
npm run dev      # local site
npm run build    # production build + search index
```

Requires the Node version listed in `package.json`.

## Pull requests

- Keep each pull request focused on one change.
- Check light and dark themes, a narrow phone width, and keyboard navigation.
- Don't add runtime dependencies without discussing them first.
- Update the README when behavior changes.

By contributing, you agree your work is released under the MIT license.
