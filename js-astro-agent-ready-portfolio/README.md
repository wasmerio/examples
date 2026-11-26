<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Agent Ready Portfolio](https://github.com/ITZSHOAIB/astro-agent-ready-portfolio) Astro theme by ITZSHOAIB, copied from commit `3118f71178da25858f099f606d088ebd84f1eaa0` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-agent-ready-portfolio.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [ITZSHOAIB](https://github.com/ITZSHOAIB), NOASSERTION. The theme's license file is kept unchanged.
<!-- wasmer:end -->

<div align="center">

# astro-agent-ready-portfolio

**A portfolio AI agents can read, and your coding agent can set up.**<br>
An Astro theme · Tailwind · fully static · Ask AI, `llms.txt` and a blog built in.

[![MIT licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)
![Astro 7](https://img.shields.io/badge/Astro-7-bc52ee)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Static](https://img.shields.io/badge/output-static-22c55e)

<a href="https://astro-agent-ready-portfolio.sohab.dev"><img src="docs/screenshots/home.webp" alt="The portfolio home page with the placeholder person Alex Rivera: name, role, links, and a selected-work section" width="860"></a>

<sub>Placeholder content (Alex Rivera). Everything you see is replaced by your own.</sub>

[**Live demo**](https://astro-agent-ready-portfolio.sohab.dev) · [**Use this template**](../../generate) · [Setup guide](SETUP.md) · [Agent runbook](RUNBOOK.md) · [Deploy](DEPLOYMENT.md)

</div>

---

## Built for AI readers

More people now ask an assistant about you than read your site. This theme gives the assistant your real work to read.

<div align="center">
<img src="docs/screenshots/ask-ai.webp" alt="The Ask AI about me dialog: question tabs (Quick summary, Notable work, Fit for a role, Interview prep), buttons for Claude, ChatGPT and Gemini, and the prompt it sends" width="576">
</div>

- **Ask AI about me.** One click opens Claude or ChatGPT with your portfolio as context and a question already typed: a quick summary, notable work, fit for a role, or interview prep. Gemini cannot be prefilled, so its button copies the prompt.
- **`/llms.txt` and `/llms-full.txt`.** Who you are, your work and every post as one Markdown file, generated from your content.
- **A `.md` version of every post,** so an agent reads your writing without scraping HTML. On a post, readers can also select a passage and ask Claude or ChatGPT about it.

## Set it up with your coding agent

In an empty folder, open Claude Code, Codex, Cursor, Gemini CLI or any coding agent and say:

> Build my portfolio with the Astro theme github.com/ITZSHOAIB/astro-agent-ready-portfolio. Create it with `pnpm create astro@latest my-portfolio --template ITZSHOAIB/astro-agent-ready-portfolio --install --no-git --no-ai --skip-houston --yes`, then follow its RUNBOOK.md.

Already have a copy? Open that folder and say:

> Set this up as my portfolio. Follow RUNBOOK.md.

Attach your resume, LinkedIn export or old site and the agent takes your details from it, shows you what it will publish, and leaves out private details such as your phone number. Otherwise it interviews you (name, links, work history, skills), fills in `content/`, deletes the placeholders, and runs one command that tells it exactly what is still wrong. When it is done it hands you the few steps only you can do: push to GitHub, connect a host, point your domain.

Later, the same agent keeps the site up to date: "write a post about X", "add my new job", "add this project". `RUNBOOK.md` tells it how, and `pnpm verify` checks the result.

No account, API key or CMS is involved. Your site is a folder of Markdown and typed data files.

## "Done" is a command, not a feeling

`pnpm check-content` is the checklist. On a fresh template it lists every placeholder that is still there, with the file and the field:

```text
$ pnpm check-content
check-content: 40 problems

- content/site.ts: site.url is still the starter value "https://alex-rivera.example". Replace it with your own.
- content/site.ts: site.name is still the starter value "Alex Rivera". Replace it with your own.
- content/profile.ts: profile.email is still the starter value "alex@alex-rivera.example". Replace it with your own.
- content/experience.ts: still holds the example entries. Replace them with your own, or empty the list if you have none.
- content/public/resume.pdf: is still the placeholder file. Replace it with your own, or pass --allow-placeholders if you do not have one yet.
...
```

When the list is empty it prints `check-content: ok`. It also catches broken links, missing images, a post that points at a project that does not exist, and an accent colour that is not a colour. `--json` gives the same output as data for scripts. Every message says what to fix.

## What you get

<table>
<tr>
<td width="50%"><img src="docs/screenshots/post.webp" alt="A blog post page with a table of contents, code block and Read with Claude and ChatGPT buttons"></td>
<td width="50%"><img src="docs/screenshots/blog.webp" alt="The blog index with posts and filters"></td>
</tr>
<tr>
<td><sub>Posts in Markdown: table of contents, syntax highlighting, callouts, animated figures, "read with" buttons.</sub></td>
<td><sub>A blog index with tag and project filters, feeds and a social image for every post.</sub></td>
</tr>
</table>

- **Content as files.** Prose in Markdown, structured data (experience, skills, projects) as typed TypeScript with a comment above every field.
- **Blog.** Markdown posts, tags, RSS and JSON feeds, reading progress, generated Open Graph images, redirects for renamed posts.
- **Built for AI readers.** Ask AI about me, `llms.txt`, `llms-full.txt` and a `.md` version of every post ([above](#built-for-ai-readers)).
- **Fully static.** Every page is built ahead of time; no server, no functions. Analytics are optional and cookie-free (Cloudflare Web Analytics).
- **Switches, not forks.** Every feature is a flag in `content/site.ts`, plus an `accent` colour.
- **Safe to automate.** `pnpm verify` runs type checks, tests, the content check and a production build.

<div align="center">
<img src="docs/screenshots/mobile.webp" alt="The home page on a phone" width="300">

<sub>Responsive down to 320px.</sub>
</div>

## Quick start

You need Node 24 and pnpm. Start a new site from the theme:

```sh
pnpm create astro@latest --template ITZSHOAIB/astro-agent-ready-portfolio
```

The command asks a few questions. Scripts and agents can skip them: `pnpm create astro@latest my-portfolio --template ITZSHOAIB/astro-agent-ready-portfolio --install --no-git --no-ai --skip-houston --yes`.

Then, inside the new folder:

```sh
pnpm install
pnpm dev                # http://localhost:4321
pnpm check-content      # what is still a placeholder
pnpm new:post "My first post" --description "One sentence." --tags notes --publish
pnpm verify             # type checks, tests, content check, build
```

By hand or with an agent, the loop is the same: edit `content/`, run `pnpm check-content`, repeat until it says `ok`. Details in [SETUP.md](SETUP.md).

## Where things live

| Path | What |
| --- | --- |
| `content/site.ts` | URL, title, descriptions, `accent` colour, feature flags, analytics token |
| `content/profile.ts` | Your name, role, bio, links, email |
| `content/experience.ts`, `skills.ts` | Work history and skills |
| `content/selected-work.ts`, `github-projects.ts` | The cards on the home page; projects can have their own page in `content/projects/` |
| `content/posts/*.md` | Blog posts (six examples; `hello-world.md` is the authoring guide) |
| `content/public/` | Photo, social image, resume, icons |
| `src/` | The site itself. You should not need to edit it |
| `scripts/` | `check-content`, `new:post`, `new:project` |

## Feature flags

In `content/site.ts`:

| Flag | Turns on |
| --- | --- |
| `blog` | `/blog`, post pages, feeds, tags, the home-page section |
| `askAi` | The "Ask AI" button and dialog |
| `openToWork` | A soft availability line in the hero |

`accent` sets the highlight colour (active filters, reading progress, focus rings). It takes a 6-digit hex.

## Deploy

The build is plain static files in `dist/`, so any static host works. Use `pnpm verify` as the build command and `dist` as the output directory. Host notes in [DEPLOYMENT.md](DEPLOYMENT.md).

## FAQ

**Do I need to use an agent?** No. Every step works by hand; the agent just removes the typing.

**Which agents work?** Any that can edit files and run commands. The instructions live in `RUNBOOK.md`. `AGENTS.md` (Codex, Cursor, GitHub Copilot and most others), `CLAUDE.md` (Claude Code) and `GEMINI.md` (Gemini CLI) all point to it, so every agent finds the same runbook. `pnpm create astro` replaces `AGENTS.md` with Astro's generic one unless you pass `--no-ai`; the runbook is a separate file, so it survives either way. If in doubt, tell the agent to follow `RUNBOOK.md`.

**Why no CMS?** Your content is a few Markdown and TypeScript files in git, which an agent or an editor can change and `check-content` can verify. A CMS would add an account, a service and a second source of truth.

**Can I change the design?** The code in `src/` is yours once you copy the template. The `accent` colour is the supported knob; anything beyond that is ordinary Astro work: `.astro` components with a little vanilla TypeScript, no UI framework.

**Which host?** Any static host. Cloudflare Pages and Netlify also read the generated `_redirects` file for renamed posts. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Licence

MIT for the code, see [LICENSE](LICENSE). The posts, photos, resume and images of the original site this template was made from are not licensed for reuse, and are not in this repository.
