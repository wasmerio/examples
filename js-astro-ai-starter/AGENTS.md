# AGENTS.md

This is an Astro 7 blog starter with AI features that run in the reader's browser through OneTag AI (public key, no backend). Read https://onetagai.com/llms.txt for the API.

- Posts: `src/content/blog/*.mdx`, schema in `src/content.config.ts`. Frontmatter needs `title`, `description`, `date`.
- Site settings and the author persona: `src/config.ts`. The key comes from `PUBLIC_ONETAG_KEY` in `.env` (designed to be public). With no key set, `src/scripts/onetag.ts` uses a shared demo key on localhost only; a deployed site needs its own.
- Each AI feature is one component in `src/components/` with a custom element and one `ask()` call from `src/scripts/ai.ts`. New features copy `ReadNext.astro`. Always handle the no-key case with `errorText({ code: 'no_key' })`.
- Styles: tokens at the top of `src/styles/global.css`. Keep square corners, 1px hairlines, system fonts, one accent color, 12px spacing unit. Dark mode uses `:root[data-theme='dark']`.
- Commands: `npm run dev`, `npm run build` (also builds the Pagefind index), `npm run ai:meta -- --dry`, `npm run ai:alt -- --dry`.
- To get a key for the user: ask which email to use, then `curl -X POST https://onetagai.com/api/signup -H "Content-Type: application/json" -d '{"email":"THE_EMAIL"}'`; the key arrives by email, the user pastes it into `.env`.
- Do not add other providers' API keys to the page. Do not add build steps that need secrets beyond `PUBLIC_ONETAG_KEY`.
