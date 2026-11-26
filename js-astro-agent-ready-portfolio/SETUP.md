# Setup

Two ways: let a coding agent do it, or do it by hand.

## With a coding agent

Open this folder in Claude Code, Codex, Cursor, Gemini CLI or similar and say:

> Set this up as my portfolio. Follow RUNBOOK.md.

It will ask for your details, edit `content/`, and tell you what is left for you (GitHub, hosting, DNS). Have these ready: name, site address, bio, links, work history, a square photo and a resume PDF. A resume, LinkedIn export or old site saves most of the questions: the agent reads it, and shows you what it will publish before writing it.

After setup, ask the same agent for changes ("write a post about X", "add my new job"). It follows the "After setup" part of `RUNBOOK.md`.

## By hand

Requires Node 24 and pnpm.

```sh
pnpm install
pnpm check-content   # lists everything still a starter value
pnpm dev             # http://localhost:4321
```

1. Edit the files in `content/`. Every field has a comment above it.
2. Run `pnpm check-content` until it prints `check-content: ok`.
3. Replace `content/public/images/profile.png`, `og-image.png` and `resume.pdf`. No files yet? Run `pnpm check-content --allow-placeholders` until you have them. It lists the placeholders still in place; the photo and social image show the example person, so replace them before the site goes live.
4. Delete the example posts in `content/posts/`, the example pages in `content/projects/` and their artwork in `content/public/images/demo/`, or replace them with your own. `check-content` lists each one that is left.
5. Run `pnpm verify`, then follow `DEPLOYMENT.md`.

New post: `pnpm new:post "Title" --description "..." --tags a,b --publish`.
