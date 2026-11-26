A fastfetch-inspired single-page portfolio template for **Astro 7** + **Tailwind CSS 4**, themed around a *fastfetch / neofetch*-style terminal session.

## What's in the box

- **26 distro color schemes** — debian, arch, ubuntu, kali, fedora, nixos, macos, windows and 18 more. Switchable from the header, persisted in localStorage, no flash on reload.
- **4 TUI-style sections** built as Astro components — lazygit (bio + status), ranger (projects tree + detail), mutt (contact inbox + mailto), btop (hardware, CPU, memory, peripherals).
- **ASCII logos** fetched from [fastfetch-cli/fastfetch](https://github.com/fastfetch-cli/fastfetch), cached locally in .cache/logos/.
- **Live uptime** computed client-side from a booted_at timestamp.
- **Custom 404 page** styled as bash: command not found.

## Content lives in YAML, not in code

- **src/data.yml** holds site config (SEO, current system, hardware, about, uses, contact, projects UI, default theme, footer status).
- **src/systems.yml** holds the 26 distros with colors, kernel, shell, DE, WM, theme, terminal, font, package manager.
- **scripts/sync.ts** reads both and writes **src/config.json** (gitignored) by merging with GitHub API data for every URL in your projects queue.
- Local GitHub response cache (**/.cache/sync.json**, 1h TTL) + optional GH_TOKEN for 5000 req/h.
- Skip-if-unchanged: sync is a no-op when neither YAML changed since last run.

## SEO out of the box

Open Graph + Twitter Card with explicit image dimensions, JSON-LD WebSite schema with nested Person author block (auto-built from site.social), canonical link, apple-touch-icon, theme-color, robots.txt. All configurable from site.* in data.yml.

## DX

- Astro 7, Tailwind 4 via Vite plugin, Bun runtime.
- TypeScript strict mode, @/* path alias everywhere.
- Biome for lint + format.
- bun test for sync helpers.
- GitHub Actions workflow builds on push to data.yml / systems.yml, auto-runs sync via prebuild hook.

## Customizing for your own portfolio

1. Edit **src/data.yml#site** with your title, description, URL, social handles.
2. Add your GitHub repo URLs to **data.yml#projects**.
3. Edit **data.yml#about.bio**, **paths**, **contact.inbox**.
4. Replace **public/og.png** (1200×630) and **public/apple-touch-icon.png**.
5. Run bun install && bun run dev.
