# Contributing

Thanks for contributing to Quiet Pages.

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

- Keep posts in `src/content/blog`, one folder per post, with its images beside it.
- Keep site settings, authors, sections, tags, and homepage copy in `src/config` rather than in components.
- Add a section, tag, or author to `src/config` before using it in a post; the build fails otherwise.
- Use the design tokens in `src/styles/global.css` instead of hard-coded colors.
- Add icons as SVG files in `src/icons` rather than inline markup.
- Prefer small, focused pull requests.

## Before Opening a PR

- Run `npm run release:check`.
- Check keyboard behavior, both color modes, and narrow screens for any interface change.
- Add a line to `CHANGELOG.md` for user-visible changes.
- Update `README.md` or `CUSTOMIZATION.md` when setup, features, or customization points change.

## Pull Request Notes

- Explain what changed and why.
- Include screenshots when the change affects the interface.
