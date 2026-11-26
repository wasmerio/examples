# Publication checklist

External steps below are pending until someone runs them. Repository creation and Firebase Hosting are separate
operations. This file does not perform them.

## GitHub

Pending:

1. Create the public repository `nandomoreirame/terminalnoir-astro-theme`.
2. Mark that repository as a template.
3. Set the description, topics and the MIT license.
4. Review the files before the first upload. Do not upload `node_modules`, `dist` or secrets.
5. From a temporary directory, install with
   `npm create astro@latest -- --template nandomoreirame/terminalnoir-astro-theme` and run `npm run verify`.

## Maintainer demo

Pending. The maintainer demo is Firebase Hosting in the project `ascode-themes`. Confirm the Hosting site ID and the
hostname from `firebase hosting:sites:list`. Do not assume either one matches the project ID. Deploy only in a
separately authorized publication step.

Replace `public/og-image.svg` with a 1200 by 630 PNG before that demo is published. SVG is not accepted by every social
platform. Capture real screenshots: desktop and mobile, Noir and Paper. The current social file is a placeholder.

## Astro theme catalogue

Pending. Authenticate to the Astro Dev Portal and read the submission fields that are current at that time. Suggested
categories, if the portal still offers them: Landing Page, Docs, Other. Suggested tags, only if the portal accepts them:
Astro, TypeScript, Tailwind.

Draft listing:

> Terminal Noir: a static Astro starter for developer tools and open-source projects, with Noir and Paper modes,
> bilingual pages, integration showcases and customizable local content.
