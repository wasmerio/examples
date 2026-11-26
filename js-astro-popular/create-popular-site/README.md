# create-popular-site

Start a community site on [Popular](https://popular.mariatta.ca/), a warm,
community-first Astro theme for meetups, user groups and small events.

```bash
npm create popular-site@latest
```

or, skipping the questions:

```bash
npm create popular-site@latest my-community -- --template aquarium --site https://my.community --yes
```

## Templates

| Template | What it is |
|---|---|
| `starter` | "Your Community": a neutral skeleton, ready to fill in. The default. |
| `aquarium` | Rocky Cove Aquarium Club: a fuller meetup example |
| `foodie` | Lucky Town Foodie Club: a fuller meetup example |
| `kdrama` | KDrama Fan Club: a fan community with a photo gallery |
| `superfan` | Truly Madly Riley: a personal site, no organizers |

All of them are fictional. The flavored ones are useful when you would rather
edit something down than fill something in.

## What you get

A small project that **depends on** the theme rather than containing a copy of
it:

```
popular.config.ts     your settings: name, nav, footer, brand, UI strings
src/content/          your events, posts, organizers, speakers, venues, docs
src/content.config.ts one line, adopting the theme's content model
public/images/        your images
astro.config.mjs      site + base, and the theme integration
```

Updating is `npm update astro-theme-popular`. You are not holding a copy of the
theme, so there is nothing to re-merge, which is what makes a site survive
being handed to the next organizer.

## Options

| Flag | Meaning |
|---|---|
| `-t`, `--template <name>` | one of the templates above (default `starter`) |
| `--site <url>` | the URL the site will be served from. A project-page URL like `https://you.github.io/my-community/` is split into Astro's `site` and `base` for you. |
| `-y`, `--yes` | accept defaults, ask nothing (also the behavior when stdin is not a TTY) |

## Licence

MIT. The theme, its demos and this scaffolder all ship from
[Mariatta/astro-theme-popular](https://github.com/Mariatta/astro-theme-popular).
