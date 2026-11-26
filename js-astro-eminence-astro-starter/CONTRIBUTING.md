# Contribution Policy

To keep the codebase clean and the history searchable, we follow a strict structure for branches, commits, and issues.

## 🏗 Workflow & Branching

The `main` branch is the `production` branch. All code in `main` must be stable and ready for users.

### Branch Naming Convention

Before starting work, create a branch using the following format: `issue-number-type/brief-description`

> Standard Branch: `42-feat/api-integration`

## 💬 Commit & Type Philosophy

We use Conventional Commits. The `type` used in your commit should match the `type` in your branch name and the primary label of the issue.

### Supported Types

```text
| Type     | Description                                                             |
| :------- | :---------------------------------------------------------------------- |
| feat     | A new feature or an improvement of an existing one.                     |
| fix      | A bug fix.                                                              |
| docs     | Documentation only changes.                                             |
| refactor | Improving code quality, formatting, or logic without changing behavior. |
| deps     | Dependency updates (npm/pnpm packages) and external library changes.    |
| test     | Adding or correcting tests.                                             |
| revert   | Reverting a previous commit.                                            |
```

**Commit Format:** `type(scope): description`

_Example:_ `feat(auth): add cloudflare access support`

**Revert Format:** Must begin with `revert:`, followed by the header of the reverted commit. The body must include the SHA:

_Example:_ `revert: 123456abcdef`

## 🏷 Labels vs. Types

While your `branch` and `commit` must stick to a single `type` for traceability, `issues` can have multiple labels to provide more context.

**Example Scenario:**

- Issue: A task to improve the SEO performance and speed of the image component.
- Issue Labels: `feat`, `perf`, `seo`, `lighthouse`.
- Your Branch: `12-feat/image-optimization`
- Your Commit: `feat(ui): optimize image loading and alt tags for seo`

## 🚀 How to Contribute

1. Fork the repository: Create your own copy of the project.
2. Create a branch: Follow the `issue-number-type/brief-description` convention.
3. Commit your changes: Use the conventional commit `type`s.
4. Push & Pull Request:
   - Push to your fork.
   - Open a PR against the `main` branch.
   - Clearly describe the changes and link the issue (e.g., `Closes #12`).
