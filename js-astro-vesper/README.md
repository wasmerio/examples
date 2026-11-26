<!-- wasmer:start -->
## Deploy on Wasmer

This folder is the [Vesper](https://github.com/astronomic-dev/vesper) Astro theme by astronomic-dev, copied from commit `2b6a08dc320251ac2d09c54aac313c3faafb97db` so it can be deployed as a Wasmer Edge template.

- **Demo:** https://astro-vesper.wasmer.app
- **Deploy:** open the template on [wasmer.io/templates](https://wasmer.io/templates) and click **Deploy**, or run `wasmer deploy` in this folder. Wasmer installs with pnpm, runs the build script with Node 24 and serves the static `dist/` folder.
- **Changed for Wasmer:**
  - None. The theme builds as published.
- **Environment variables:** None.
- **Credit:** theme by [astronomic-dev](https://github.com/astronomic-dev), MIT. The theme's license file is kept unchanged.
<!-- wasmer:end -->

# Astronomic Vesper

A free Astro theme for a personal site: a blog and a portfolio in one. The demo is a fictional designer and developer who writes, ships projects, gives talks and takes film photos outdoors. It has a home page with a photo collage, articles (with categories, tags and series), projects, speaking, uses, a Now page, an about page with a work history, search and a privacy page.

Content comes from Markdown files in `content/` by default. EmDash is supported as a second source.

```sh
pnpm install
pnpm dev            # Markdown source, at http://localhost:4321
pnpm build          # a static site in dist/
pnpm seed:emdash    # EmDash: load seed/seed.json, seed/seo.json and the demo images into ./data.db
pnpm check          # type-check
pnpm test:units     # the theme's unit tests
```

## Shared code

The shared code is in `packages/`. It is part of this repo, so you can change it as you need:

- `@astronomic/ui`: the components and design tokens.
- `@astronomic/content`: the content sources and their contract.
- `@astronomic/theme-core`: the theme plumbing (routes, meta tags, feeds, share images, search parts and the test runners).

## Site URL

Set your site's public address before you build. The feed, the sitemap, robots.txt, the share images and the newsletter form's hidden links need it. Set the `SITE_URL` environment variable (for example `SITE_URL=https://<your-domain> pnpm build`, with your own domain in place of `<your-domain>`), or edit the `site` line in `astro.config.mjs`. Until you set it, a static build's links point at `https://example.com`, and an EmDash server's use the address the server sees for each request, usually `http://localhost`.

## Sources

- **Markdown (the default).** Posts, projects, talks, uses items, jobs, collage photos and pages are files in `content/` (one folder each). Images are in `content/media/`. Categories, tags and series are in `content/taxonomies.json`, the menus in `content/menus.json` and your settings in `content/site.json`. `pnpm build` makes a static site.
- **EmDash.** Run `pnpm seed:emdash` once (add `--reset` to start over; it deletes the database's content). It loads the schema and the same demo content into `./data.db` and copies the demo images to `uploads/`. Then build with `CONTENT_SOURCE=emdash pnpm build` (or change `"markdown"` to `"emdash"` in `astro.config.mjs`) and start it with `pnpm start`. Set `SITE_URL` when you run it too: `SITE_URL=https://<your-domain> pnpm start`, with your own domain in place of `<your-domain>`. Without it, the links use the address the server sees for each request, which is `http://localhost` with the port unless `security.allowedDomains` in `astro.config.mjs` names your domain, and the log has one line asking for `SITE_URL`. EmDash builds a server site. The site title and tagline are EmDash's site settings; the rest of the settings are in the one-entry "Profile" collection.

## The look

Pick the look in `src/theme.config.ts`. It applies to both sources. `pnpm check`, `pnpm dev` and every build (EmDash's too) stop on an unknown id. A production server never fails on it: a bad value there falls back to the default and is logged.

- `look`: colors, fonts and the photo treatment. `"clear"` (cool neutral gray, Host Grotesk over Onest; the default), `"field"` (Field notes: warm paper, Vollkorn over Commissioner; photos become prints with a one-line caption) or `"trail"` (Trail map: cool gray with a fine grain and contour lines behind the intro, Sora over Public Sans; photos sit in an even mat inside a thin line).
- `accent`: links, buttons, the focus ring and small accent text. `"glacier"` (lake blue, the default), `"moss"` (green), `"alpenglow"` (warm red) or `"dusk"` (violet). Each passes 4.5:1 as text in every look, light and dark.
- `collage`: the photo band on the home page. `"mosaic"` (a wide grid past the text column, the default), `"row"` (one full-width row; two offset rows on smaller screens) or `"sheet"` (Contact sheet: an even sheet of frames). Each layout fills its rectangle exactly for 4, 5 or 6 photos and sets the cut corners itself.
- `articleList`: the article lists (`/articles`, each category and each tag). `"grid"` (cards in two columns, one on phones, the default; a post with no photo gets a tile in the accent with its category) or `"rows"` (the home page's rows: a square photo beside the text).
- `thumbnails`: the photo on each post in a list. Off: the same rows and cards, text only.
- `nowLine`: the Now line under the intro on the home page. Off: no line.
- `pages`: `projects`, `speaking`, `uses` and `now`, each on by default. Off leaves a page out everywhere: its address answers 404, and the nav, the footer, the sitemap, search, the feed and the home page drop it.
- `builtWith`: the "Built with Astronomic" link in the footer. Off by default. Turn it on to credit the theme.

Light and dark mode follow the visitor's system, and the switch in the nav lets them pick. Under reduced motion, nothing moves.

The theme's own words (button labels, empty states, the list pages' default titles) are in `src/theme.strings.ts`.

## Settings

In `content/site.json` (EmDash: the Profile entry). An empty setting gives a plain fallback, never a broken link or form.

| Setting | What it does | Empty |
| --- | --- | --- |
| `title`, `tagline` | The site's name (each page's browser title, the feed and the share cards) and a one-line description (the home page's and the feed's description, and the line in the author box under each post). | `title` is required. No tagline: the home page's description is your `bio`, the author box shows your role. |
| `name`, `role` | Your name (the nav, the author box, the footer) and your role. | "Your Name"; no role. |
| `avatar`, `avatarAlt` | Your photo, in the intro, the about page and the author box. `avatarAlt` describes it on the about page (Markdown only; see Alt text below). | Your initials. |
| `headline`, `bio` | The intro's heading and paragraph. Mark one phrase in the heading with asterisks (`chase light *above treeline*`) to set it apart. | A placeholder heading; no paragraph. |
| `socials` | Your profile links: a `label`, an `href` and an `icon` id (`bluesky`, `email`, `github`, `instagram`, `linkedin`, `mastodon`, `rss`, `website`, `youtube`). | No links. An unknown icon id shows the Website icon, and the build prints a warning. |
| `nowLabel` | The Now page's name ("Status"): the nav, phone menu and footer links to `/now`, the chip on the home page's Now line, and the page's title when there is no `now` page entry. The address stays `/now`. | "Now". |
| `nowStatus`, `nowUpdated`, `nowPlace` | The Now line under the intro, and the Now page's "Updated" date and place. | No Now line. |
| `newsletterAction` | Where the newsletter form posts (your newsletter tool's form address). | The card becomes "Follow by RSS", a link to `/rss.xml`. |
| `newsletterOptions` | The form's options: `emailName` (the email field's name), `honeypot` (your tool's spam trap name, such as `_hp`), `nameField` and `nameName` (a name field), and `hiddenFields`. A hidden field whose value is a site path (`/thanks`) becomes a full URL on your `SITE_URL`. | The tool's defaults. |
| `newsletterNote` | A short line under the form ("Join 2,140 readers."). | No line. |
| `cvFile` | The Download CV link: a file in `public/` (`/files/cv.pdf`) or an `https:` URL. | No Download CV. |
| `sampleContent` | The demo's flag: turns `[[fill in: …]]` markers into warnings, whatever `SITE_URL` says; allows placeholder addresses while `SITE_URL` is not your real address; and shows the "Sample content" note in the footer. | Markers and placeholder addresses stop the build. |

In EmDash the setting names are in snake case (`now_label`, `now_status`, `cv_file`, `sample_content`), and the newsletter options are flat fields (`newsletter_email_name`, `newsletter_honeypot`, `newsletter_name_field`, `newsletter_name_name` and the `newsletter_hidden` list). To add an icon, put `<name>.svg` in `src/icons/` (see `src/icons/CREDITS.md`).

**Set a real newsletter address before you launch.** The demo's form has a placeholder address on `example.com`. What it does depends on the site:

- On a site that is not live (your own machine, or a static build with no real `SITE_URL`), a form on an `example.com` address sends nothing and shows "This is a demo, so nothing was sent."
- With a real `SITE_URL`, a static build stops and lists the address, even with `sampleContent` on.
- A production EmDash server always counts as live, and it runs no check. A form on an `example.com` address does not show at all: the card becomes "Follow by RSS", and the server log names the setting, so a visitor's email never goes there.

### Alt text

Each content photo is described for screen readers on its own page. Where the description lives depends on the source:

- **Markdown:** a key beside the photo's key. `thumbnailAlt` (a post), `imageAlt` (a project or a page), `groupImageAlt` (a uses item's `groupImage`) and `alt` (a collage photo) are required whenever their photo is set, and the build stops on an empty one. `avatarAlt` in `content/site.json` is optional: with none, the about page uses your name. `logoAlt` is optional: logos are decorative.
- **EmDash:** the media item's own alt text. Set it when you upload the photo, or edit it in the media library. A collage photo has its own Alt text field in its entry, which is required and wins over the media item's. Logos are decorative here too.

### Pages and lists

- **The collage.** The home page's band shows the photos in the collage collection (`content/collage/`): 0, 4, 5 or 6. With none there is no band. Each photo needs alt text. `place` and `year` are Field notes' caption, `geo` is Trail map's label, and a `link` makes the photo a link; without one it opens large.
- **Projects, Speaking and Uses.** A pages entry with the slug `projects`, `speaking` or `uses` sets that page's title and lead line (its `summary`). With none, the page uses the theme's words.
- **Uses items.** Each item sits under its `group`. `groupImage` (with `groupImageAlt`; EmDash `group_image`, described by the media item's alt text) gives the group a photo; the group takes the first one its items have. `linkButton` shows the item's link as a button, in the words of `linkLabel` (EmDash `link_button`, `link_label`); with no label, the link says "Visit the site".
- **The Now and about pages.** The `now` and `about` pages entries hold their text. `image` and `imageCaption` (EmDash `image_caption`) give the Now page its photo and caption. The about page lists the work history from the jobs collection.
- **Photos open large.** A click on a photo opens it full screen, with previous and next for the other photos on the page. This works for a post's or project's main photo, photos in the text, collage photos with no `link`, the Now photo, and the about photo only when it is 1000px wide or more (an EmDash about photo with no known width does not open). With JavaScript off, the photo is a link to its large file. A photo in the text gets a caption from its title in Markdown (`![A tent in the snow](../media/tent.webp "Stevens Pass, 2025.")`) and from the image block's Caption field in EmDash. A photo that is a link stays a link, and a photo with empty alt text stays as it is; both keep their caption.

### Search and share fields

A post, a project or a page can set its own title, description, share image and canonical address for search engines and link previews. Each one is optional; a field you leave out falls back to the entry's own.

- **Markdown:** an `seo:` block in the frontmatter, with `noindex` beside it as before.

  ```yaml
  seo:
    title: "Title for search results and shares"      # else the entry's title
    description: "One or two sentences."              # else its summary
    image: ../media/share.webp                        # a local image, like the entry's other photos; else its photo
    canonical: https://example.com/original-post/    # an absolute http(s) address; else none
  noindex: true                                       # hide from search engines
  ```

  The build stops on an empty title or description, a canonical that is not a full `http://` or `https://` address, or an unknown key in the block.
- **EmDash:** the entry's SEO panel (title, description, image, canonical and "Hide from search engines").

`seed/seo.json` holds the EmDash demo's SEO panel values, which `pnpm seed:emdash` writes, so the demo matches the Markdown files.

### The setup check

`pnpm build` (Markdown) and `pnpm dev` check the settings and stop with a list of problems:

- a collage with a count other than 0, 4, 5 or 6;
- a `newsletterAction`, `cvFile` or hidden field link that is neither an `https:` URL nor a site path, or a `cvFile` path that is not a file in `public/`;
- a honeypot name that browsers fill in (`email`, `name`, `url`, `phone`);
- a content link that is not an `https:` URL, a site path, a `#` link, `mailto:` or `tel:` (the menus, the socials, and a project's, talk's, uses item's, job's or collage photo's link);
- placeholder addresses, unless `sampleContent` is on and `SITE_URL` is not your real address: a newsletter action, hidden field, CV address, social link, menu link, Markdown `seo.canonical`, or the link of a project, talk, uses item, job or collage photo, on `example.com` (or a subdomain of it, or `.example`), and a social link to a profile site's home page with no username (the demo's are, such as `https://github.com`). A real `SITE_URL` stops on these even with `sampleContent` on, because a form on a placeholder address takes no signups;
- `[[fill in: …]]` markers in the text of your pages, posts, projects, talks, uses items, jobs and collage photos, unless `sampleContent` is on. The list names each entry. Fill each one in, or turn `sampleContent` on to build anyway; with it on, the build warns about each marker, whatever `SITE_URL` says.

With EmDash, the check runs in `astro dev` only. A production server never checks and never shows a problem on a page; a bad value there gives the fallback (no band, "Follow by RSS", no Download CV, or the link left out). A `[[fill in: …]]` marker has no fallback: an EmDash build renders no page, so a marker in published content shows on the live site. Replace each one before you publish.

## Privacy page

The privacy page (`content/pages/privacy.md`) is a template. The theme has no backend and runs no analytics: the visitor's browser sends the newsletter form straight to your newsletter tool. Each `[[fill in: …]]` marker asks for one fact: your name and a contact email, your newsletter tool and what it stores, your host and its logs, and the privacy laws that apply to you (such as the CCPA in California). The build stops until every marker is gone (or `sampleContent` is on).

## Search, feed and share images

A static build indexes posts, projects and pages with Pagefind after the build (`/search`); try it with `pnpm build`, then `pnpm preview`. With EmDash, the search page asks EmDash on each request. A page hidden from search engines is not in the index.

The feed is at `/rss.xml`, the sitemap at `/sitemap.xml` and robots.txt at `/robots.txt` (all in `src/pages/`). Every public page gets a 1200 x 630 share image at `/og/…/card.png`; an entry with an SEO image uses it, and a post or project with its own photo uses that photo. The card's font and colors are in `src/share-card.ts`.

## Tests

```sh
pnpm test:units      # the unit tests
pnpm test:adapter    # build the selected source and check its content and pages
pnpm test:parity     # build every source and compare content and pages
pnpm test:no-emdash  # prove a Markdown build needs no EmDash package
pnpm test:system     # check the design system pages: off by default, on with the flag
pnpm test:skins      # check each accent's values and contrast in every look
```

The EmDash runs seed a fresh demo database for the run; they never read `./data.db`. The pages and page checks the tests use are in `scripts/theme-tests.mjs` and `scripts/lib/`.

## Design system

Run `pnpm dev`, then open `/system`. It shows the colors, type, components and sections. A build adds it only with `ASTRONOMIC_SYSTEM=1`.

## Licenses

- The theme: MIT (`LICENSE`).
- Fonts: Host Grotesk, Onest, Vollkorn, Commissioner, Sora, Public Sans, Vesper Mono and Overpass Mono, under the SIL Open Font License (`src/assets/fonts/OFL.txt`).
- Demo photos: CC0; replace them with your own. Their sources are in `content/media/CREDITS.md`.
- Icons: the social icons are from Simple Icons (CC0) or drawn for the theme (MIT). The LinkedIn logo is a trademark of LinkedIn Corporation, used only to link to a LinkedIn profile. See `src/icons/CREDITS.md`. Brand marks belong to their owners.
- Parts of the EmDash setup come from the EmDash starter template, under the MIT License (`LICENSE-EMDASH`).
