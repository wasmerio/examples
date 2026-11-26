# Contributing

Thanks for contributing to Lucenta.

## Local Setup

```bash
npm install
npm run dev
```

## Common Commands

```bash
npm run dev            # local dev server
npm run check          # type and content checks
npm run build          # production build
npm run preview        # serve the production build
npm run format         # format every file
npm run release:check  # check, build, and format check together
```

## Project Guidelines

- Keep projects in `src/content/work`, people in `src/content/people`, and journal entries in `src/content/journal`, one folder per entry with its images beside it.
- Keep page copy in `src/config` rather than in components.
- Attach scroll and pointer effects through the data attributes in `src/scripts/motion.ts`.
- Use the design tokens in `src/styles/global.css` instead of hard-coded colors.
- Prefer small, focused pull requests.

## Before Opening a PR

- Run `npm run release:check`.
- Check keyboard behavior, reduced motion, and narrow screens for any interface change.
- Add a line to `CHANGELOG.md` for user-visible changes.
- Update `README.md` or `CUSTOMIZATION.md` when setup, features, or customization points change.

## Pull Request Notes

- Explain what changed and why.
- Include screenshots when the change affects the interface.
