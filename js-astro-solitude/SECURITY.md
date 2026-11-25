# Security Policy

## Supported code

Security fixes are developed against the latest code on `main`. Older snapshots and customized forks do not have separate security maintenance; update to the latest code and apply relevant fixes to your site. This project does not currently maintain multiple release support branches.

## Report a vulnerability

Email the maintainer at [o@efu.me](mailto:o@efu.me) with the subject `Astro Solitude security report`. Use this private channel for suspected vulnerabilities. Do not disclose exploit details in public issues, pull requests, or comments.

Include, where available:

- The affected commit or version and relevant dependency versions.
- The affected component, configuration, or generated page.
- Reproduction steps and a minimal proof of concept using test data.
- The potential impact and any suggested fix or mitigation.

Remove credentials and personal data before sending a report. Test only on systems you own or have permission to assess.

The maintainer will review the report, ask for additional details if needed, and coordinate any fix and public disclosure with the reporter. Response and resolution times depend on maintainer availability and the issue's complexity; no fixed response deadline is guaranteed. If you have not received a reply, follow up in the same email thread.

## Scope and deployment

Reports about theme code, browser scripts, build tooling, and dependencies used by Astro Solitude are welcome. Vulnerabilities in an external comment, search, music, or hosting service should also be reported to that service's security contact. Include how the issue affects this theme when reporting an integration problem here.

Generated pages and browser scripts are public. Keep private credentials out of site configuration, content, and public assets. If a credential has been exposed, revoke or rotate it with the provider; deleting it from the source alone does not remove it from previous deployments or repository history.
