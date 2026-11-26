# Security Policy

Astro Wellness is a statically generated marketing template (Astro) with **no
backend, database, authentication, or user-submitted content**. There are no
secrets, credentials, or server-side endpoints in this repository.

## Supported versions

Only the latest commit on the `main` branch is supported. The site is generated
from `main` at deploy time.

## Reporting a vulnerability

If you find a security issue in this repository — including a wrong, missing, or
breaking header configuration — please report it privately rather than opening a
public issue:

1. Open a private security advisory: **Security → Report a vulnerability** on
   the GitHub repository.
2. Describe the issue, the affected files, and steps to reproduce.

We will acknowledge within 5 business days and treat the report as confidential
until a fix is published.

## Out of scope

- The example contact details and URL placeholders in `src/data/site.ts` and
  `astro.config.mjs` are intentional template sample content.
- The contact form is static: it opens the visitor's email client with a
  pre-filled `mailto:` message. It accepts no user input server-side.