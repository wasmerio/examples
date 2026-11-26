# Contributing

Thanks for your interest in improving the **Astro Portfolio Template**!
Issues, feature ideas and pull requests are all welcome.

---

## Ways to contribute

- 🐛 **Report a bug** — open an issue with steps to reproduce, what you
  expected, and what happened. For scroll-film bugs, include the browser,
  device, and whether it's a touch screen.
- 💡 **Suggest a feature** — open an issue describing the use case before
  building, so we can agree on scope.
- 📝 **Improve docs** — typos, clarifications and better examples are great
  first contributions.
- 🔧 **Fix or build** — grab an open issue (or file one), then send a PR.

---

## Development setup

```bash
npm install
npm run dev                # http://localhost:4321
```

See [Project structure](./README.md#project-structure) for where things live.

---

## Before you open a PR

All of these must pass — CI runs the same commands:

```bash
npm run check              # astro check: types
npm run test:unit          # Vitest
npm run test:install       # once: Playwright's Chromium
npm test                   # Playwright
```

- **Keep the page readable without JavaScript.** Content is real HTML; motion
  only enhances it. Anything new must also respect `prefers-reduced-motion`.
- **Keep the scroll maths pure.** Logic goes in `src/scripts/scroll-film-core.ts`
  with a unit test; `scroll-film.ts` only wires it to the DOM.
- **No personal data in the template.** Copy, images and links stay neutral
  placeholders (`Your Name`, `example.com`).
- **Never weaken a test to make it pass.** If behaviour changes on purpose,
  write a new test for the new behaviour.
- **Match the surrounding code** — naming, formatting and comment density.

---

## Commit messages

Short imperative subject (`Add touch fallback for…`, `Fix tilt on…`), with a
body explaining *why* when it isn't obvious.
