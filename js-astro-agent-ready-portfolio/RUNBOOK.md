# Portfolio runbook (for coding agents)

This repo is an Astro portfolio that builds to static files. Everything about the owner lives in `content/`. Requires Node 24 and pnpm (run `corepack enable` if pnpm is missing).

## 0. Which job is this?

If the folder is empty and the human wants a portfolio from this theme, create it first. This command never prompts:

```sh
pnpm create astro@latest my-portfolio --template ITZSHOAIB/astro-agent-ready-portfolio --install --no-git --no-ai --skip-houston --yes
```

Then work inside `my-portfolio/` and run `git init` there. (`--no-ai` stops `create-astro` from writing its own generic `AGENTS.md`; this runbook is the one to follow.) Otherwise, run `pnpm install` once, then:

```sh
pnpm check-content --allow-placeholders
```

- **It lists problems:** setup is not finished. Your job is to turn the placeholder person (Alex Rivera) into the real owner, then hand the human the few steps only they can do. Follow sections 1 to 4.
- **It prints `check-content: ok`:** the site is already set up. Do what the human asked, following section 5. If it also lists "Placeholders still in place", remind the human to replace those files.

## Setup

You are done when `pnpm check-content` prints `check-content: ok` (or `pnpm check-content --allow-placeholders` does, when the human has no photo, social image or resume yet; see below) and `pnpm verify` ends with a successful build. `pnpm verify` skips the starter check so a fresh template can build, so it does not prove setup is finished: always run `check-content` yourself. Do not stop earlier, and do not edit code under `src/` to get there.

If the human has no photo, social image or resume yet, run `pnpm check-content --allow-placeholders` instead. It accepts those three placeholder files, lists them under "Placeholders still in place", and still checks everything else. The placeholder photo and social image show the example person (the photo is of a fictional person), so the site must not go live with them. Copy that list into your report and tell the human to replace the files before they deploy. Never fake the check by editing the placeholder files.

## 1. Ask the human first

Collect these before editing. Do not invent any of them.

If the human gives you source material (a resume, a LinkedIn export, an old site, a GitHub profile), take the answers from it instead of asking again. Then show the human a short summary of what you will publish and ask them to confirm or correct it before you write it. Ask only for what the material does not cover.

Everything you write is published on a public site. Never copy a phone number, home address, date of birth or similar private detail from source material, unless the human asks for it to be shown. Use only the email address and links the human wants public.

- Full name.
- The site address, for example `https://jane.dev` (the domain they own or will buy).
- One-line job title and a two-sentence "about me".
- Public email, plus links: GitHub, LinkedIn, X/Twitter, anything else they want shown.
- Current company and focus line.
- Work history (role, company, dates, two or three bullets each) and skills.
- Up to three pieces of selected work and any open-source projects to list.
- A square photo (at least 512x512) and a resume PDF. If they have none yet, keep the placeholders and say so.
- Where they are based (or leave it out), and which features to keep: `blog`, `askAi`, `openToWork` (see `content/site.ts`).

If the human does not answer a question, use these defaults and list them in your report: `blog` off unless they have posts, `openToWork` off, `askAi` on, `analyticsToken` empty, no location. Optional fields (`location`, a project card's `stars`, `updated` and `language`, a project page's `updated`) are deleted rather than filled with made-up values. For required text the human did not give you, write the shortest honest value from facts you have, and list it in your report so they can improve it:

| Field | If you have nothing |
| --- | --- |
| `profile.focus` | A fragment from their role and skills, e.g. "accessible user interfaces" (it is spliced into a sentence) |
| `profile.current`, `profile.previous` | One sentence from the role and work history they gave you |
| `profile.writing` | Something short and true, e.g. "I have not published any posts yet." (hidden with the blog) |
| `site.twitterHandle` | `""` |
| `site.openToWorkText` | `""` when `openToWork` is off |
| Experience `highlights`, selected-work `metrics`, `stack` | `[]` |
| `careerStartDate` | The first day of the year they gave you |

On Windows the files may use CRLF line endings; make multi-line edits with a tool that preserves them.

The "about me" lives in `content/profile.ts` (`current`, `previous`, `writing`) and the short description in `content/site.ts`.

## 2. What you can do

Each file starts with comments saying what every field does. Edit values, keep the structure.

| To change | Edit |
| --- | --- |
| Name, URL, title, descriptions, feature flags | `content/site.ts` |
| Bio, links, email, company, focus | `content/profile.ts` |
| Section titles and intro text | `content/copy.ts` |
| Work history | `content/experience.ts` |
| Skills | `content/skills.ts` |
| Selected work cards | `content/selected-work.ts` |
| Open-source project cards | `content/github-projects.ts`, with an optional page in `content/projects/*.md` |
| Blog posts | `content/posts/*.md` (create with `pnpm new:post`) |
| Photo, social image, resume, icons | `content/public/` (keep the file names, or update the paths in `content/site.ts`) |
| Animated blog figures | `content/figures/` |

Commands:

```sh
pnpm install                   # once
git init                       # if the folder is not a git repo yet; deployment needs one
pnpm check-content             # what is still a starter value or broken; run until it says ok
pnpm check-content --json      # same, machine-readable
pnpm check-content --allow-placeholders  # accept placeholder photo, social image and resume
pnpm new:post "Title" --description "..." --tags a,b --publish
pnpm new:project "Name" --repo <url> --description "..."
pnpm dev                       # preview at http://localhost:4321
pnpm verify                    # type checks, tests, content check, production build
```

Loop: edit, run `pnpm check-content`, read each problem (it names the file and the field), fix, repeat. Then run `pnpm verify`.

Rules:

- Replace the example content: the posts in `content/posts/`, the project pages in `content/projects/`, and the covers and screenshots in `content/public/images/demo/`. Delete them, or turn them into real content. Do not leave them in. `check-content` lists every untouched one, and `--allow-placeholders` does not accept the demo images.
- Replace `content/public/images/profile.png`, `og-image.png` and `resume.pdf` with the human's files. If they have none, use `--allow-placeholders` (above) and tell them which files must still be replaced before the site goes live.
- If the human has no blog, set `features.blog` to `false` and delete the example posts.
- Write only facts the human gave you. Never invent employers, dates, links or metrics.
- Do not add dependencies, and do not touch `src/` or `scripts/` during setup.

## 3. What only the human can do

Hand these over as a short numbered list when the content is done. Do not try to run them.

1. Push the repo to their GitHub account.
2. Connect the repo to a static host such as Cloudflare Pages or Netlify (`DEPLOYMENT.md`). Approve the first deploy.
3. Point their domain at it: DNS records and the custom domain at the host.
4. Optional: create a Cloudflare Web Analytics site and paste its token into `analyticsToken` in `content/site.ts`.
5. Review the site in the browser and approve the copy. You cannot judge how it reads.

## 4. Writing posts

`content/posts/hello-world.md` documents frontmatter, callouts, figures and code blocks. Read it before writing the human's first post, then replace it. The other example posts show covers and captioned images in use.

## 5. After setup

The site is set up when `pnpm check-content --allow-placeholders` prints `check-content: ok`. From then on, do what the human asks. End every change with `pnpm verify`, and keep `check-content` passing.

| The human asks to | Do |
| --- | --- |
| Write a post | `pnpm new:post "Title" --description "..." --tags a,b` creates a hidden draft. Write the body (see `hello-world.md`), then delete the `draft: true` line when the human approves it |
| Add a project | Add a card to `content/github-projects.ts`. For a page of its own, `pnpm new:project "Name" --repo <url> --description "..."` creates one in `content/projects/` |
| Update work history, skills or links | Edit the file in `content/` (table in section 2) |
| Turn a feature on or off, change the colour | `features` and `accent` in `content/site.ts` |
| Replace the photo, social image or resume | Overwrite the file in `content/public/`; update `width`/`height` in `content/site.ts` if the size changed |

The same rules apply: write only facts the human gave you, and publish nothing private they did not ask for.

### Changing the design

Edit `src/` only when the human asks for a design or behaviour change that `content/` cannot make. Keep `scripts/` as it is: `check-content` is how you and the human know the content is right. Where things are:

| Path | What |
| --- | --- |
| `src/pages/index.astro` | The home page: which sections show, in what order |
| `src/components/` | Home-page sections (`HeroSidebar`, `SelectedWorkSection`, `ExperienceSection`, `SkillsSection`, `ProjectsSection`, `BlogSection`) and cards |
| `src/components/blog/`, `src/pages/blog/` | The blog index, post pages and their parts |
| `src/layouts/` | `Base.astro` (every page) and `BlogShell.astro` (blog and project pages) |
| `src/styles.css`, `src/lib/styles/blog.css` | Global styles and post typography |
| `src/lib/` | Content loading, feeds, `llms.txt`, Open Graph images, icons |

The site is dark only, styled with Tailwind classes in the components. Keep text contrast at 4.5:1 or more, keep it usable by keyboard, and check it at 320px wide. Then run `pnpm verify`.
