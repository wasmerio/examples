# Security Policy

## Supported versions

Only the latest release on `main` receives security fixes. Dependabot keeps
dependencies current with weekly pull requests.

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Reporting a vulnerability

Please **don't** open a public issue for security problems. Instead, report
privately through
[GitHub security advisories](https://github.com/floating-astronaut/astro-portfolio-template/security/advisories/new)
or by email to **tejaskagrawalgwl@gmail.com**.

Include what you found, how to reproduce it, and the impact you expect. You'll
get an acknowledgement within a week. If the report is accepted, a fix is
released and you're credited in the release notes unless you'd rather not be;
if it's declined, you'll get an explanation.

## Scope

The template is a static site: there is no server, database or form handler.
The most relevant areas are the build scripts, third-party dependencies, and
anything that injects HTML (the analytics loader and the build-time SVG logos).
