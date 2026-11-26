# Contributing to starglow

Thanks for helping. starglow is a small theme with a strong opinion about
staying minimal, so please open an issue before a large change or a new
feature: it saves both of us time.

## Ground rules

- One purpose per pull request.
- Minimal client JavaScript. A feature that needs a framework or a large
  dependency is unlikely to be accepted; make it optional if it is.
- Accessibility (WCAG AA) and `prefers-reduced-motion` are not optional.
- Hover and focus states must never shift layout.
- No external service may be required for a build.

## Setup

```sh
pnpm install
pnpm dev          # http://localhost:4321
```

Or, with only Docker on the host, `./dev.sh`. See
[docs/07-development.md](docs/07-development.md) for every command.

## Before you open a pull request

Run the same checks as CI:

```sh
./dev.sh ci       # format, lint, astro check, build, links, dist assertions
```

Natively: `pnpm format:check && pnpm lint && pnpm build && pnpm verify`.

Release notes are generated on GitHub from pull request labels, so label
user-visible changes `enhancement`, `bug` or `documentation`. If a change
breaks an existing site, label it `breaking` and add upgrade steps to
[UPGRADING.md](UPGRADING.md).

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):
`feat(footer): …`, `fix(search): …`, `docs: …`. Header only: one line of at
most 72 characters, no body and no trailers; put the why in the pull request.
Run
`git config core.hooksPath .githooks` once to have the format checked on
every commit.

## Licence

By contributing you agree that your contribution is licensed under the
project's [MIT License](LICENSE).
