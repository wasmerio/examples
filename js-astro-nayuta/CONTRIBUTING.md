# Contributing to Nayuta

Thanks for your interest in contributing to Nayuta!

Contributions can improve the theme, documentation, examples, or accessibility.
Nayuta favors static HTML, readable content, and small native browser enhancements.

## Before Contributing

Search existing [issues](https://github.com/yuanzui-cf/nayuta/issues),
[pull requests](https://github.com/yuanzui-cf/nayuta/pulls), and
[discussions](https://github.com/yuanzui-cf/nayuta/discussions) before starting.

| Use        | For                                                                                                            | Include                                                                                                          |
| ---------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Issue      | Reproducible bugs, incorrect documentation, or an agreed feature with concrete scope.                          | Expected and actual behavior, reproduction steps or a small example, relevant versions, and the proposed result. |
| Discussion | Usage questions, customization advice, open-ended ideas, design trade-offs, or feedback on a possible feature. | The problem you want to solve, context, and alternatives you have considered.                                    |

Discuss substantial features, public API changes, new dependencies, and broad
refactors before implementing them. Once the direction is agreed, an issue can
track the work. Small typo fixes or straightforward documentation corrections can
go directly to a PR. If Discussions is unavailable, use an issue clearly labeled
in its title as a question or proposal.

Keep each contribution focused on one problem and avoid unrelated formatting or
personal site configuration changes.

## Requirements and Setup

Install [Git](https://git-scm.com/) and a current stable [Bun 1.x](https://bun.sh/)
(recommended). Bun can install dependencies, run the development server, check
types, run tests, format code, and build the site without a separate Node.js
installation.

Alternatively, [Node.js 22.12 or newer](https://nodejs.org/) can run Astro, but
this is not recommended for contributions: the test suite uses `bun:test` and
Bun APIs, so Bun is still required. The commands below use Bun. If Node.js is
also installed, `bun run --bun <script>` explicitly selects the Bun runtime.

Use the versions declared in `package.json` and resolved by `bun.lock` rather
than installing Astro or TypeScript globally.

1. Fork [yuanzui-cf/nayuta](https://github.com/yuanzui-cf/nayuta) on GitHub.
2. Clone your fork and configure the upstream repository, replacing
   `YOUR_USERNAME` below with your GitHub username:

   ```sh
   git clone https://github.com/YOUR_USERNAME/nayuta.git
   cd nayuta
   git remote add upstream https://github.com/yuanzui-cf/nayuta.git
   git fetch upstream
   git switch -c docs/improve-setup upstream/main
   ```

3. Install dependencies and start the development server:

   ```sh
   bun install
   bun run dev
   ```

Open [localhost:4321](http://localhost:4321). Use `bun install` for dependency
changes and include `bun.lock` when those changes update it. Avoid adding other
package-manager lockfiles.

## Branch Names

Use `<type>/<name>`, with a short, lowercase, hyphen-separated name:

```text
feat/custom-sidebar
fix/mobile-navigation
docs/improve-setup
refactor/post-list
```

Choose a type from `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `ci`, or
`build`. Start new contributions from the current upstream `main`.

## Code Conventions

Read the [development guide](docs/develop/index.md) for visual design,
directory ownership, imports, content schemas, and component APIs. Update the
relevant document when changing a contract, configuration option, or convention.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) with a scope and
a capitalized, imperative summary:

```text
<type>(<scope>): <Summary>

<Short explanation of the change or its purpose>
```

Use the same types as branch names. Scopes should identify the area, such as
`docs`, `content`, `layout`, or `pagination`. Keep the subject concise, omit its
final period, and separate the body with a blank line. Use `!` and a
`BREAKING CHANGE:` footer when a change breaks a public contract, including
migration guidance.

```text
fix(layout): Restore focus after closing drawers

Return keyboard focus to the opening control so navigation can continue.
```

Keep commits focused and independently understandable. Include related tests and
documentation with the change. Do not commit secrets, local environment files,
dependencies, caches, or build output.

## Checks and Formatting

Use the scripts in `package.json` from the repository root:

| Command                | Purpose                                                                    |
| ---------------------- | -------------------------------------------------------------------------- |
| `bun run format`       | Apply Prettier, including the Astro plugin, to the repository.             |
| `bun run format:check` | Verify formatting without writing files.                                   |
| `bun run check`        | Run Astro diagnostics and TypeScript checking.                             |
| `bun run test`         | Run Bun unit tests, isolated build fixtures, and available browser checks. |
| `bun run build`        | Generate the static site in `dist/` and validate rendered content.         |
| `bun run preview`      | Serve the production build for manual review.                              |

For code, configuration, or rendered content changes, format the changes and run
`format:check`, `check`, `test`, and `build` before submitting. Review the diff
after formatting so unrelated files do not enter the PR. Add or update tests
when behavior changes; test fixtures should not modify authored content.

Documentation-only changes to the README, contribution guide, or developer docs
need formatting and a review of links, examples, and Markdown rendering. They do
not require application tests or a site build. Markdown/MDX in `src/content/`
is rendered site content and should be checked accordingly. There is no separate
`lint` script.

When working on a few files, use the installed formatter with an explicit file
list to avoid formatting unrelated files:

```sh
bun x --no-install prettier --write README.md CONTRIBUTING.md 'docs/develop/*.md'
bun x --no-install prettier --check README.md CONTRIBUTING.md 'docs/develop/*.md'
```

Browser tests skip when Chromium/Chrome is unavailable. Report skipped checks
explicitly; a passing test command with skipped browser cases does not establish
browser coverage. No Playwright dependency is required: fixtures use Bun and the
browser's debugging protocol.

For layout or interaction changes, preview the affected pages on desktop and
mobile, around the 1120px and 768px layout transitions, and across the bundled
palettes. Check keyboard navigation, visible focus, drawer closing/focus return,
long text, horizontal overflow, and behavior without JavaScript. Use `/demo`,
`/posts/typography-test`, post/tag archives, and the friends page where relevant.
Template schema changes also require a build because custom validation runs
when templates render.

## Submitting a Pull Request

Push your branch to your fork:

```sh
git push -u origin docs/improve-setup
```

Open a PR from that branch to `yuanzui-cf/nayuta:main`. Use a Conventional Commit
title that describes the final change. Open a draft if work or feedback is still
pending; mark it ready when the contribution is complete.

Include the following in the description:

- **Problem and result:** what prompted the change and what users will experience.
- **Related context:** links to the issue or discussion; use `Closes #123` only
  when the PR fully resolves that issue.
- **Implementation:** the relevant approach, public API changes, dependency
  changes, and migration steps.
- **Visual changes:** before/after screenshots at relevant widths and palettes.
- **Limitations:** remaining concerns or follow-up work reviewers should know.

Omit a **Validation** section when all applicable checks pass. If checks fail,
are skipped, or cannot run, include this section and explain which checks did
not pass, why, and why the PR can still be merged despite the missing validation.
Support that reasoning with relevant evidence, the affected scope, and any
remaining risk or follow-up work so the maintainer can assess the exception.

Respond to review on the same branch, update documentation and checks as needed,
and keep the description accurate as the implementation changes. Maintainers
handle merging after review.
