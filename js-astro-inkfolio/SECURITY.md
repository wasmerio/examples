# Security policy

## Reporting a vulnerability

Do not open a public issue. Use GitHub's private vulnerability reporting on this repository, or the email listed on the author's site. Include the affected file or URL, what an attacker gains, and the steps you took; a proof of concept helps but is not required.

Expect an acknowledgement within a few days. This is a one-person project: fixes ship when they are correct, not when they are fast.

## Scope

In scope: the theme's own code — templates, components, the `scripts/` toolchain, the inline scripts shipped to the browser, and the documented configuration surface.

Out of scope: the hosting provider, DNS, a fork's own content or secrets, and anything that requires modifying the reader's machine.

## What this theme does on purpose

- No third-party JavaScript at runtime. Fonts and icons are bundled locally. Analytics is Umami (cookieless) by default; GA4 and Clarity only after consent.
- The weather widget needs no API key: it uses a keyless lookup made by the browser. If you configure `geoEndpoint`, keep that endpoint server-side.
- No secrets belong in the repository. Configuration is YAML; anything sensitive goes in the host's environment variables.

## Supported versions

Only the latest state of `main` is supported. Older tags are not patched.
