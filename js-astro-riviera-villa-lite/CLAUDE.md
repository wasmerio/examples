# CLAUDE.md

@AGENTS.md

## Notes for Claude Code

- Start any content change in `villa.config.ts`; the build tells you what is missing.
- When the owner sends texts in one language, translate them into every language of `languages.active`, one line per language, in a natural tone for holiday guests.
- When the owner sends photos, name them after what they show, place them in `src/assets/photos/`, set their `category` and write their `alt` in every active language.
- Before saying a change is done, run `npm run check`, `npm test` and `npm run build`, and look at the page with `npm run dev`.
