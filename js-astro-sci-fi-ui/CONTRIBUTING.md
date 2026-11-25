# Contributing

Thanks for helping improve this Astro sci-fi UI template.

## Prerequisites

- **Node.js** ≥ 22.23.4 (see `package.json` `engines`, [Astro 6 requirements](https://docs.astro.build/), and the [October 21, 2026 Node.js security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)).
- npm (or another client compatible with `package-lock.json` if present).

## Local workflow

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm install`     | Install dependencies             |
| `npm run dev`     | Dev server (default port 4321)   |
| `npm run build`   | Production build (run before PR) |
| `npm run preview` | Serve the production build       |

## Pull requests

- Keep changes focused and match existing patterns (imports, Tailwind usage, Astro composition).
- For **UI changes**, include before/after screenshots or a short screen recording in the PR description when it helps reviewers.
- Run `npm run build` and fix any build errors before opening a PR.

## Accessibility

- Use keyboard navigation on changed flows (Tab, Enter, Space, Escape).
- Prefer visible **`:focus-visible`** styles (see global focus rules and component patterns).
- When content updates without a full navigation (charts, mock logs), consider **`aria-live`** regions so assistive tech gets meaningful updates.
- Respect **reduced motion**: user setting `data-sf-animations="off"` and `prefers-reduced-motion` should disable decorative motion where possible.

## Islands and client JS

- Prefer **static HTML** by default; add React or client scripts only when the feature needs it.
- Use **`client:visible`** when an island can defer until near the viewport; use **`client:only`** when the component cannot run during SSR (for example TensorFlow in this repo).
- Heavy demos (MapLibre, charts, TensorFlow) can be turned off for slim forks via **`PUBLIC_*` flags** — see [README](README.md) and [`.env.example`](.env.example).

## Third-party services

If you change map tiles, embeds, or model loading, read [docs/third-party.md](docs/third-party.md) and keep disclaimers accurate.

## License

By contributing, you agree your contributions are licensed under the same terms as the project ([LICENSE](LICENSE)).
