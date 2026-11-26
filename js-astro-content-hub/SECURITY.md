# Security Policy

## Supported versions

`astro-content-hub` is a static site template. Only the latest release on the
`main` branch receives fixes.

| Version | Supported |
|---------|-----------|
| latest (`main`) | ✅ |
| older releases | ❌ |

## Reporting a vulnerability

We take security reports seriously. **Please do not open a public GitHub issue
to report a security vulnerability.**

Instead, report it privately via GitHub:

1. Go to
   [**Security > Advisories > Report a vulnerability**](https://github.com/awareride/astro-content-hub/security/advisories/new).
2. Fill in the advisory with a description, reproduction steps, and the impact.
3. Submit it - only the repository maintainers will see it.

If you cannot use GitHub private vulnerability reporting, you may instead email
the maintainers by opening a regular issue asking for a private contact
channel (without disclosing the vulnerability details).

## What to include

To help us triage quickly, please include:

- A clear description of the issue and its impact.
- Steps to reproduce (minimal example).
- The affected version/commit, and whether it is reproducible on `main`.
- Any suggested fix or mitigation.

## Response time

We aim to acknowledge reports within **72 hours** and to provide an initial
assessment within **7 days**. Coordinated disclosure timelines are agreed on a
case-by-case basis with the reporter.

## Scope

This project is a **static site template**: it renders Markdown to HTML and
deploys static files. Out of scope:

- Vulnerabilities in dependencies that are already patched upstream - upgrade
  the dependency instead.
- Issues in downstream sites built *from* this template that do not reproduce
  in this repository.
- Social engineering, denial-of-service against the documentation hosting
  provider, or content spam.

## Security considerations when self-hosting

If you deploy this template and set up the content-sync workflow, take care
with:

- **Sync tokens:** the fine-grained PAT used by external repos needs only
  **Contents: write** and **Pull requests: write** on this hub repo - grant no
  more. Store it as a repository secret, never commit it.
- **Dependency review:** review `package.json` changes before merging, and run
  `npm audit` in your environment.
- **Build secrets:** the deploy workflow secrets (`CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`) must remain in GitHub Actions secrets.
