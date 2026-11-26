# French bakery example (exemple en français)

A complete French-language configuration for Chalet — the original demo
content this theme was battle-tested with (a fictional bakery in Chamonix).

Use it to ship a French site in three steps:

1. Replace `src/config/site.ts` with `site.ts` from this folder.
2. Replace `src/pages/legal-notice.astro` and `src/pages/privacy-policy.astro`
   with the files from `legal-pages/` (French legal prose adapted to the
   French LCEN + RGPD requirements). Keep the same file names so the footer
   links keep working, or update `SITE.ui` labels and the Footer hrefs if you
   prefer French URLs.
3. Rebuild. Every visible string on the site is now French — components never
   hard-code text.

This also doubles as a translation guide for any other language: copy
`site.ts`, translate the content and the `ui` section, adapt the legal pages
to your jurisdiction.
