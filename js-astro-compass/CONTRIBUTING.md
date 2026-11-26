# Contributing

Thanks for contributing to Compass.

## Local Setup

```bash
npm install
npm run dev
```

Search is generated during the build, so use the production build to test it:

```bash
npm run build
npm run preview
```

## Common Commands

```bash
npm run dev            # local dev server
npm run check          # type and content checks
npm run build          # production build and search index
npm run preview        # serve the production build
npm run format         # format every file
npm run release:check  # check, build, and format check together
```

## Project Guidelines

- Keep docs content in `src/content/docs`, one folder per article, with its images beside it.
- Update `src/config/docs.ts` when adding or reorganizing categories.
- Register new MDX components in `src/components/docs/mdx-components.ts`.
- Use the design tokens in `src/styles/global.css` instead of hard-coded colors.
- Prefer small, focused pull requests.

## Before Opening a PR

- Run `npm run release:check`.
- Check keyboard behavior, both color modes, and narrow screens for any interface change.
- Add a line to `CHANGELOG.md` for user-visible changes.
- Update `README.md` or `CUSTOMIZATION.md` when setup, features, or customization points change.

## Pull Request Notes

- Explain what changed and why.
- Include screenshots when the change affects the interface.
