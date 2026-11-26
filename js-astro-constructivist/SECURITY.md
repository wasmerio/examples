# Security policy

Constructa is a static theme, not a hosted account or content-management service.
Your published configuration and assets are public. Do not put API keys,
passwords, private resumes, or other secrets in `cv.json`, `public/`, or Git.

## Reporting a vulnerability

Please do not post exploitable security details in a public issue.

Use the repository's private
[Report a vulnerability](https://github.com/MiraHikari/astro-constructivist/security/advisories/new)
page. Private vulnerability reporting is enabled for this repository. If GitHub
temporarily does not offer that option, use a private contact channel published
by the maintainer; do not post exploit details publicly.

Include the affected revision, a minimal reproduction, the expected impact,
and any proposed mitigation in the private report. No response-time guarantee
or paid support commitment is implied.

## Scope

Reports about the theme's handling of untrusted content, generated pages,
deployment configuration, and dependency exposure are relevant. Report a
vulnerability in an upstream package to its maintainers as well.

The latest development branch is the starting point for fixes. Review release
notes and update dependencies before deploying; historical releases do not have
a separate long-term-support policy.

## Safe configuration

- Treat remote images and links as third-party resources; use trusted sources.
- Do not interpret arbitrary configuration strings as HTML or executable code.
- Use your host's HTTPS and security-header facilities where available.
- GitHub Pages has different header controls from application hosting; do not
  assume a Netlify or Vercel header rule applies there.
- Remove example contact details and verify generated canonical and social URLs
  before making your fork public.
