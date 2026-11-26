# Security policy

## Reporting a vulnerability

Please report privately rather than in a public issue, using GitHub's
[private vulnerability reporting](https://github.com/DuvInc/astro-ai-i18n/security/advisories/new)
on this repository. That opens a channel visible only to you and the maintainer.

This is a one-person project. You should get an acknowledgement within a few
days; if a week passes with no reply, feel free to nudge by opening a public
issue that says only that you are waiting on a private report, with no details.

Please include what an attacker can do, not only what looks wrong: the commit,
the configuration that exposes it, and the smallest reproduction you have.

## What is in scope

This repository builds a static site and runs a script that sends text to a
third-party API. The interesting surface is small and worth naming:

- **Credential handling.** Anything that would cause `AIGLOT_API_KEY` to be
  written to a tracked file, printed to standard output, recorded in shell
  history, or sent anywhere other than AI Glot.
- **The translation scripts.** Anything in `src/i18n/strings/en.json` or a post
  that can escape the JSON payload, or a translated value that can escape the
  file it is written into — a frontmatter injection through a translated title
  is the realistic case.
- **The build.** Content that can inject script into a rendered page.
- **Fallback correctness.** Anything that makes a page publish under a locale
  it should not, or a canonical point at a URL the site does not own. That is a
  correctness bug with a search-engine consequence rather than a breach, and it
  is still worth reporting.

## What is out of scope

- AI Glot itself. Report that to [ai-glot.com](https://ai-glot.com), not here.
- The quality or accuracy of a machine translation.
- The dummy content, which is fictional and exists to be replaced.
- A vulnerability that requires the attacker to already have commit access.

## If you started a site from this template

Replace the link above with your own repository. This file arrived with the
code and points at somebody else's advisories.
