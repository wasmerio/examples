# Contributing to Constructa

Thanks for helping make a distinctive portfolio theme more usable and reliable.
Small, well-evidenced improvements are welcome.

## Choose the right kind of change

- **Personalizing your site:** edit `cv.json` in your own copy. You do not need
  to submit your biography, project screenshots, or private contact data upstream.
- **Bug report:** include the browser, viewport, theme settings, reproduction
  steps, and expected result. A small anonymized configuration helps.
- **Feature proposal:** describe the user problem before suggesting a dependency
  or framework change. The theme should remain a static Astro document.
- **Security issue:** follow [SECURITY.md](SECURITY.md), not a public issue.

## Development

Use Node.js 24 LTS and pnpm 12.16.1, then:

```bash
pnpm install
pnpm dev
```

Read [AGENTS.md](AGENTS.md), the [configuration guide](docs/CONFIGURATION.md),
and [architecture](docs/architecture.md) before changing shared behavior.

## Pull request expectations

1. Keep the change focused. Explain the problem, the fix, and why it belongs in
   the theme rather than only in one portfolio's configuration.
2. Add a regression test for a behavioral fix when practical.
3. Update documentation for public configuration or behavior changes.
4. Provide before/after screenshots for visual changes, including mobile.
5. Preserve reduced-motion, keyboard focus, no-JS content, and print behavior.
6. Check repository-subpath deployment if URLs, SEO, or assets changed.

Do not replace the project's visual language with a generic component library,
add fabricated demo claims, or vendor assets without redistribution rights.
Dependencies retain their own licenses; see [third-party notices](LICENSES/THIRD_PARTY.md).

## Checks

```bash
pnpm run ci
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Report failures and untested cases rather than changing assertions merely to
make a suite pass. The browser suite is not a substitute for visual inspection.
Avoid committing screenshots or traces except intentional, reviewed
documentation assets under `docs/images/`.

## Configuration changes

Keep public fields in `cv.json`, editor hints in `cv.schema.json`, and runtime
validation in `src/data/schema.ts` aligned. Default values should produce a
complete, readable page. Empty optional lists and disabled sections must not
leave broken links, empty dialogs, or misleading counters.

## Commit and review

Use a concise Conventional Commit subject when possible, such as
`fix: restore all skills in print` or `docs: explain project image paths`.
Keep existing notices, avoid unrelated formatting churn, and do not rewrite
other contributors' commits without agreement.

Contributions to original theme code are provided under the project's MIT
license. A contribution does not grant permission to relicense dependencies,
fonts, trademarks, or third-party assets.
