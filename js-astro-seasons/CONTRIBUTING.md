# Contributing

Thanks for your interest in Seasons. Bug reports, fixes, and improvements are welcome.

## Before you start

- Check the [open issues](https://github.com/nicomiguelino/astro-seasons/issues) to see if your idea or bug is already tracked.
- For anything bigger than a small fix, open an issue first so we can agree on the approach.

## Set up

```sh
git clone https://github.com/nicomiguelino/astro-seasons.git
cd astro-seasons
npm install
npm run dev   # dev server on :4321
```

`npm install` also sets up a Husky pre-commit hook that runs `lint:check`, `format:check`, and `check`. Fix any failures before committing. See the [README](README.md) for the full list of scripts and how the tests work.

## Make a change

1. Create a branch from `main`. Name it after the change type, for example `feat/short-description` or `fix/short-description`.
2. Make your change. Keep it focused on one thing.
3. Run the checks:

   ```sh
   npm run lint:check
   npm run format:check
   npm run check
   npm run build
   npm run test:e2e
   ```

   If your change affects how pages look, review the updated images in `screenshots/` before committing.

4. Commit using [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(blog): add MDX support`.

## Open a pull request

- Target the `main` branch.
- Use a Conventional Commits title: `type(scope): subject`.
- Keep the description short. Bullet points work well. Link the issue it closes, for example `Closes #21`.
- Add at least one label. Release notes are grouped by label:

| Label           | Release notes section |
| --------------- | --------------------- |
| `enhancement`   | Features              |
| `bug`           | Bug Fixes             |
| `documentation` | Documentation         |
| `chore`, `ci`   | Maintenance           |

The `Checks` workflow runs lint, format, and E2E tests on every pull request. They need to pass before merging.

## License

By contributing, you agree that your contributions are licensed under [AGPL-3.0-or-later](LICENSE), the same as the project.
