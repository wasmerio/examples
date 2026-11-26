# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in this template, please report it
privately — do **not** open a public GitHub issue.

Use GitHub's private vulnerability reporting:
**Security → Report a vulnerability** on this repository.

We will acknowledge reports within 5 business days and aim to ship a fix
within 30 days for confirmed issues.

## Scope

This repository is a static site template. Security issues most likely to be
in scope:

- Cross-site scripting (XSS) vectors in components or layouts
- Insecure defaults in the Content Security Policy or security headers
- Vulnerabilities introduced by the build/setup scripts

Issues in third-party dependencies (Astro, USWDS, etc.) should be reported
upstream to those projects; feel free to also open a dependency-update issue
here.

## For agencies deploying this template

- Security headers in `public/_headers` only apply on hosts that support them
  (Netlify, Cloudflare Pages). GitHub Pages ignores them — see README.md.
- The CSP is generated at build time via `astro.config.mjs`; review it before
  adding any third-party scripts.
- Forms are scaffolding only and do not transmit data until you wire a backend.
