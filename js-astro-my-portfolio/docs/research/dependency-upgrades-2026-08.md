# Dependency upgrade research (Aug 2026)

Research-only notes for `/Users/rishikesh/Engineering/personal/my-portfolio`. No packages were upgraded. Claims below cite primary sources (official changelogs, GitHub releases, npm package metadata, and official docs).

**Project context consulted:** `package.json` (Astro 7.1.0, TypeScript 6.0.3, `typecheck`: `tsc --noEmit && astro check`), `tsconfig.json` (extends `astro/tsconfigs/strict`), `.oxlintrc.json` (no `typeAware`), `.oxfmtrc.json`, and `framer-motion` imports in React components (no Emotion / Styled Components).

## Summary recommendation

### Upgrade now

- `astro` 7.1.0 → 7.2.1
- `@astrojs/mdx` 7.0.3 → 7.0.5
- `@astrojs/react` 6.0.1 → 6.0.2
- `@astrojs/check` 0.9.9 → 0.9.10
- `react` 19.2.7 → 19.2.8
- `react-dom` 19.2.7 → 19.2.8
- `@types/react` 19.2.17 → 19.2.18
- `@types/react-dom` 19.2.3 → 19.2.4
- `@hugeicons/core-free-icons` 4.2.2 → 4.2.3
- `framer-motion` 12.42.2 → 13.1.0
- `oxfmt` 0.59.0 → 0.63.0 (expect possible format churn; re-run `bun run format` / `format:check`)
- `oxlint` 1.74.0 → 1.78.0

### Hold / review first

- `typescript` 6.0.3 → **hold at 6.x** (do not upgrade to 7.0.2 yet)
- `@types/node` 24.13.3 → **already latest on the 24.x line**; do not upgrade to 26.x

### Astro ↔ TypeScript verdict

**Yes, stay on TypeScript 6 with Astro 7.2.x.** Astro’s published `@astrojs/check@0.9.10` peer range is `typescript: ^5.0.0 || ^6.0.0` ([npm `@astrojs/check` peerDependencies](https://www.npmjs.com/package/@astrojs/check?activeTab=dependencies); [registry metadata for 0.9.10](https://registry.npmjs.org/@astrojs/check/0.9.10)). **Do not upgrade to TypeScript 7 yet:** Microsoft’s TypeScript 7 announcement states Astro (and similar Volar-based tools) need TypeScript 6 until a stable programmatic API exists ([Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)); Astro’s language server explicitly refuses TS 7’s native module because it lacks `ts.sys` / Language Service APIs ([withastro/astro#17345](https://github.com/withastro/astro/pull/17345), [language-server CHANGELOG 2.16.12](https://github.com/withastro/astro/blob/main/packages/language-tools/language-server/CHANGELOG.md), tracking [withastro/roadmap#1321](https://github.com/withastro/roadmap/discussions/1321)). This repo’s `typecheck` script depends on `astro check`, so TS 7 would break the intended workflow.

## Per-package notes

### `astro` — Current 7.1.0 → Latest 7.2.1

- **Breaking changes:** none found between 7.1.0 and 7.2.1 in the official changelog / release notes. 7.2.0 is a **minor** with additive features (`astro preview --background`, relative `logger.entrypoint`, `session: false`, experimental `incrementalBuild`, optional content `digest`). 7.2.1 is patch fixes only.
- **Notable behavioral note (not an API break):** 7.2.1 starts logging errors for content-collection `reference()` targets that resolve to missing entries ([astro@7.2.1](https://github.com/withastro/astro/releases/tag/astro%407.2.1)). Worth a quick content-collection sanity check after upgrade.
- **Compatibility notes:** `engines.node` remains `>=22.12.0` for both 7.1.0 and 7.2.1 ([npm `astro@7.2.1`](https://registry.npmjs.org/astro/7.2.1)). Matches this project’s `engines.node: >=22.12.0`. No TypeScript peer on `astro` itself; TS coupling is via `@astrojs/check` / language server.
- **Sources:** [CHANGELOG (7.2.1 / 7.2.0)](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md), [astro@7.2.0 release](https://github.com/withastro/astro/releases/tag/astro%407.2.0), [astro@7.2.1 release](https://github.com/withastro/astro/releases/tag/astro%407.2.1), [npm registry `astro@7.2.1`](https://registry.npmjs.org/astro/7.2.1)

### `@astrojs/mdx` — Current 7.0.3 → Latest 7.0.5

- **Breaking changes:** none found in primary sources for 7.0.3 → 7.0.5.
- **Changes:** 7.0.4 fixes React-cased attribute emission; 7.0.5 is a dependency bump (`@astrojs/markdown-remark` / internal helpers).
- **Compatibility notes:** peer `astro: ^7.0.0`; optional peer `@astrojs/markdown-satteri` ([registry `@astrojs/mdx@7.0.5`](https://registry.npmjs.org/@astrojs/mdx/7.0.5)). Compatible with Astro 7.2.x.
- **Sources:** [MDX CHANGELOG](https://github.com/withastro/astro/blob/main/packages/integrations/mdx/CHANGELOG.md), [npm registry `@astrojs/mdx@7.0.5`](https://registry.npmjs.org/@astrojs/mdx/7.0.5)

### `@astrojs/react` — Current 6.0.1 → Latest 6.0.2

- **Breaking changes:** none found (patch dependency bump only).
- **Compatibility notes:** peers allow React 17–19 and matching `@types/react` / `@types/react-dom` ([npm view / registry for 6.0.2](https://www.npmjs.com/package/@astrojs/react)). Fine with React 19.2.8.
- **Sources:** [React integration CHANGELOG](https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md)

### `@astrojs/check` — Current 0.9.9 → Latest 0.9.10

- **Breaking changes:** none found.
- **Changes:** 0.9.10 updates dependency `yargs` to v18.
- **Compatibility notes:** peerDependencies still `typescript: ^5.0.0 || ^6.0.0` — **TypeScript 7 is not a declared peer** ([npm package peerDependencies](https://www.npmjs.com/package/@astrojs/check?activeTab=dependencies), [registry 0.9.10](https://registry.npmjs.org/@astrojs/check/0.9.10)). Safe to bump while staying on TS 6.0.3.
- **Sources:** [astro-check CHANGELOG](https://github.com/withastro/astro/blob/main/packages/language-tools/astro-check/CHANGELOG.md)

### `typescript` — Current 6.0.3 → Latest 7.0.2 (**HOLD**)

- **Breaking / compatibility:** TypeScript 7 is a native Go port that **does not yet ship a stable programmatic compiler / language-service API**. Official guidance: projects using Astro should continue on TypeScript 6.0 for now ([Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)).
- **Astro impact:** `@astrojs/check` peers exclude `^7`; language server fails early if TS 7 native module is loaded ([PR #17345](https://github.com/withastro/astro/pull/17345); [roadmap #1321](https://github.com/withastro/roadmap/discussions/1321)). This portfolio runs `astro check` in `typecheck`, so TS 7 is unsafe now.
- **Can we stay on TS 6 with Astro 7.2.x?** **Yes** — peers and Astro’s own `devDependencies.typescript` on `astro@7.2.1` still point at `^6.0.3` ([registry `astro@7.2.1`](https://registry.npmjs.org/astro/7.2.1)).
- **Can we upgrade to TS 7?** **Not yet** for this stack, unless accepting broken / unsupported `astro check` (and peer-dep conflicts under strict npm installs). Side-by-side aliases (`@typescript/typescript6` + native 7) are documented by Microsoft but do not make Astro’s checker support TS 7 ([TS 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)).
- **Sources:** [TS 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [roadmap #1321](https://github.com/withastro/roadmap/discussions/1321), [PR #17345](https://github.com/withastro/astro/pull/17345), [@astrojs/check peers](https://registry.npmjs.org/@astrojs/check/0.9.10)

### `framer-motion` — Current 12.42.2 → Latest 13.1.0 (**MAJOR**, safe for this repo)

- **Breaking changes (13.0):** removes optional `@emotion/is-prop-valid` dependency; CSS-in-JS users of Styled Components / Emotion may need explicit `MotionConfig isValidProp={…}` injection ([Motion React upgrade guide §13.0](https://motion.dev/docs/react-upgrade-guide), [CHANGELOG 13.0.0](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)).
- **This project:** imports `framer-motion` directly (`LazyMotion`, `m`, `AnimatePresence`, etc.) and does **not** use Emotion/Styled Components, so the documented 13.0 break should not apply.
- **13.1.0:** additive `Reorder` features only ([CHANGELOG 13.1.0](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md)).
- **Compatibility notes:** peers `react` / `react-dom` `^18 || ^19` ([registry `framer-motion@13.1.0`](https://registry.npmjs.org/framer-motion/13.1.0)). Package name `framer-motion` remains published; migration to `motion` / `motion/react` is optional ([upgrade guide](https://motion.dev/docs/react-upgrade-guide)).
- **Sources:** [React upgrade guide](https://motion.dev/docs/react-upgrade-guide), [Motion CHANGELOG](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md), [motion.dev changelog](https://motion.dev/changelog)

### `react` / `react-dom` — Current 19.2.7 → Latest 19.2.8

- **Breaking changes:** none found.
- **Changes:** patch release focused on React Server Components decode performance ([GitHub release v19.2.8](https://github.com/facebook/react/releases/tag/v19.2.8)).
- **Sources:** [facebook/react v19.2.8](https://github.com/facebook/react/releases/tag/v19.2.8)

### `@types/react` — Current 19.2.17 → Latest 19.2.18

- **Breaking changes:** none found in primary sources (patch bump on DefinitelyTyped). No dedicated per-version CHANGELOG beyond npm publish metadata.
- **Compatibility notes:** within `@astrojs/react` peer range for React 19 types.
- **Sources:** [npm `@types/react`](https://www.npmjs.com/package/@types/react) (versions 19.2.17 published 2026-06-05; 19.2.18 published 2026-07-30 per `npm view … time`)

### `@types/react-dom` — Current 19.2.3 → Latest 19.2.4

- **Breaking changes:** none found (patch). Changelog evidence limited to npm version metadata.
- **Sources:** [npm `@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) (19.2.4 published 2026-07-30 per `npm view … time`)

### `@types/node` — Current 24.13.3 (24.x line)

- **Latest 24.x:** **24.13.3** — already current on the requested line (`npm view @types/node@24` / versions list ends at `24.13.3`).
- **Do not upgrade to 26.x** (npm `latest` / several TS dist-tags point at 26.2.0; Node 24 remains the intended types line per user constraint).
- **Sources:** [npm `@types/node`](https://www.npmjs.com/package/@types/node), registry version list via `npm view @types/node versions`

### `@hugeicons/core-free-icons` — Current 4.2.2 → Latest 4.2.3

- **Breaking changes:** none indicated by semver patch; **no per-version entry for 4.2.2 → 4.2.3** found in the official icon-library changelog (docs list older marketing releases, not npm patch diffs).
- **Compatibility notes:** low risk patch; verify imported icon names still resolve after upgrade.
- **Uncertainty:** thin changelog evidence for this specific bump.
- **Sources:** [npm `@hugeicons/core-free-icons`](https://www.npmjs.com/package/@hugeicons/core-free-icons), [Hugeicons icon library changelog](https://hugeicons.com/docs/changelog/core/icon-library), [unpkg README 4.2.3](https://unpkg.com/@hugeicons/core-free-icons@4.2.3/README.md)

### `oxfmt` — Current 0.59.0 → Latest 0.63.0

- **Breaking changes between range:**
  - **0.62.0:** formats `parser:yaml` files with `oxc_formatter_yaml` (marked **BREAKING**) ([apps/oxfmt CHANGELOG](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md), [apps_v1.77.0 release](https://github.com/oxc-project/oxc/releases/tag/apps_v1.77.0)).
- **Other notes:** 0.60–0.61 / 0.63 are mostly fixes/features; 0.63 adds yaml-in-css frontmatter dispatch and formatter fixes ([apps_v1.78.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.78.0)).
- **Compatibility notes:** `engines.node` `^20.19.0 || >=22.12.0` unchanged across 0.59–0.63 ([npm registry oxfmt versions](https://www.npmjs.com/package/oxfmt)). This portfolio has **no project `.yml`/`.yaml` sources** observed; YAML break is low impact here. Still expect possible JS/TS/CSS format diffs from formatter fixes — re-run `bun run format`.
- **Sources:** [apps/oxfmt/CHANGELOG.md](https://raw.githubusercontent.com/oxc-project/oxc/main/apps/oxfmt/CHANGELOG.md), [oxfmt 0.62 / oxlint 1.77 release](https://github.com/oxc-project/oxc/releases/tag/apps_v1.77.0), [oxfmt 0.63 / oxlint 1.78 release](https://github.com/oxc-project/oxc/releases/tag/apps_v1.78.0)

### `oxlint` — Current 1.74.0 → Latest 1.78.0

- **Breaking changes (user-facing, in `npm/oxlint` CHANGELOG for 1.74→1.78):** none listed. Entries are new rules, option additions, docs, and bug fixes ([npm/oxlint CHANGELOG](https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/CHANGELOG.md)).
- **Monorepo release caveats:** combined `apps_v1.77.0` notes include **internal AST** breaking changes (TypeScript AST shape). Those are primarily library-consumer breaks, not oxlint config/CLI breaks, but they explain why the GitHub release labels “BREAKING” even when the oxlint package changelog does not for this range.
- **Optional peer change:** `oxlint-tsgolint` optional peer floor moves from `>=0.24.0` (1.74.0) to `>=7.0.2001` (1.75.0+) ([registry oxlint 1.74.0](https://registry.npmjs.org/oxlint/1.74.0), [1.78.0](https://registry.npmjs.org/oxlint/1.78.0)). This project’s `.oxlintrc.json` does **not** enable `typeAware` / `--type-aware`, and `oxlint-tsgolint` is not a direct dependency — so the peer bump is irrelevant to current usage. If type-aware linting is enabled later, install a matching `oxlint-tsgolint`.
- **Sources:** [npm/oxlint CHANGELOG](https://github.com/oxc-project/oxc/blob/main/npm/oxlint/CHANGELOG.md), [apps_v1.75.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.75.0), [apps_v1.77.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.77.0), [apps_v1.78.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.78.0)

## Sources

Deduplicated primary URLs consulted:

1. https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/
2. https://github.com/withastro/roadmap/discussions/1321
3. https://github.com/withastro/astro/pull/17345
4. https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md
5. https://github.com/withastro/astro/releases/tag/astro%407.2.0
6. https://github.com/withastro/astro/releases/tag/astro%407.2.1
7. https://github.com/withastro/astro/blob/main/packages/integrations/mdx/CHANGELOG.md
8. https://github.com/withastro/astro/blob/main/packages/integrations/react/CHANGELOG.md
9. https://github.com/withastro/astro/blob/main/packages/language-tools/astro-check/CHANGELOG.md
10. https://github.com/withastro/astro/blob/main/packages/language-tools/language-server/CHANGELOG.md
11. https://docs.astro.build/en/guides/typescript/
12. https://registry.npmjs.org/astro/7.2.1
13. https://registry.npmjs.org/@astrojs/check/0.9.10
14. https://registry.npmjs.org/@astrojs/mdx/7.0.5
15. https://www.npmjs.com/package/@astrojs/check?activeTab=dependencies
16. https://motion.dev/docs/react-upgrade-guide
17. https://motion.dev/changelog
18. https://github.com/motiondivision/motion/blob/main/CHANGELOG.md
19. https://registry.npmjs.org/framer-motion/13.1.0
20. https://github.com/facebook/react/releases/tag/v19.2.8
21. https://raw.githubusercontent.com/oxc-project/oxc/main/apps/oxfmt/CHANGELOG.md
22. https://raw.githubusercontent.com/oxc-project/oxc/main/npm/oxlint/CHANGELOG.md
23. https://github.com/oxc-project/oxc/releases/tag/apps_v1.75.0
24. https://github.com/oxc-project/oxc/releases/tag/apps_v1.77.0
25. https://github.com/oxc-project/oxc/releases/tag/apps_v1.78.0
26. https://registry.npmjs.org/oxlint/1.74.0
27. https://registry.npmjs.org/oxlint/1.78.0
28. https://www.npmjs.com/package/@types/node
29. https://www.npmjs.com/package/@types/react
30. https://www.npmjs.com/package/@types/react-dom
31. https://www.npmjs.com/package/@hugeicons/core-free-icons
32. https://hugeicons.com/docs/changelog/core/icon-library
33. https://unpkg.com/@hugeicons/core-free-icons@4.2.3/README.md

## Uncertainty / thin evidence

- **`@hugeicons/core-free-icons` 4.2.2 → 4.2.3:** no primary per-patch release notes found; treat as low-risk by semver only.
- **`@types/react` / `@types/react-dom` patches:** npm timestamps confirmed; no detailed DT changelog fetched for the exact commit messages (GitHub API unavailable in this research environment).
- **`oxlint` “BREAKING” labels on monorepo app releases:** AST-internal; package-level oxlint changelog for 1.74→1.78 does not document config/CLI breaks — still re-run `bun run lint` after upgrade.
- **`astro` 7.2.1 content `reference()` error logging:** may surface previously silent bad references; not listed as a breaking API change but can change CI noise / failure modes depending on how errors are treated.
