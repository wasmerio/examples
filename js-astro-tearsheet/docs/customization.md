# Customization

Two files hold almost everything: `src/config.ts` for what the site says and does, and
`src/styles/theme.css` for how it looks. Each section below names the file to edit.

## Site identity

`src/config.ts`, `site`:

| Key              | What it does                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| `name`           | The masthead on the home page, the header on every other page, titles, the feed     |
| `description`    | Home page meta description and the feed description                                 |
| `url`            | Your production URL. Canonical links, the feed, the sitemap and `robots.txt` use it |
| `locale`         | `<html lang>`, and the language of dates and numbers                                |
| `author`         | The byline under the masthead, the subscribe page, the JSON-LD author               |
| `defaultOgImage` | The share image for every page. A file in `public/`, 1200×630                       |

There is no logo file: the name is set in the heading face. To use an image instead, replace the
link text in `src/components/common/Header.astro` and the masthead in `src/pages/index.astro`.

## Footer credit

The footer carries one line crediting the theme: `Tearsheet theme by ondelva`, linking to the
theme page on ondelva.com. It is a plain link in `src/components/common/Footer.astro`; delete it if you
would rather not have it. Keeping it is how other people find the theme. Tearsheet Pro ships
without it.

## Navigation, footer and social links

`src/config.ts`, `nav`. `header` is the top bar, `footer` is a list of titled groups (the demo ships Site and Readers), `social`
takes [Lucide](https://lucide.dev/icons) icon names. For an icon of your own, put the SVG in
`src/icons/` and use `icon: 'name'` (the filename without `.svg`).

## Words and language

Every word the theme prints is in `ui` at the end of `src/config.ts`: the meter's words, the
form, the home and archive headings, the subscribe and thank-you pages, the 404 page, the theme
switch. The sentence that says what your
newsletter covers on `/subscribe` is `ui.subscribe.intro`; rewrite it first. To publish in
another language, set `site.locale` and translate `ui`. Counts are functions, so plurals stay
right: ``issues: (count) => `${count} Ausgaben` ``.

## The newsletter

`src/config.ts`, `newsletter`:

| Key          | What it does                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `cadence`    | "Every Tuesday". Printed under the masthead, on the subscribe page and at the end of every issue                 |
| `firstIssue` | The number of your oldest issue. Moving from another platform mid-run, set it to the number that issue had there |
| `theCut`     | `true` prints the rule, the word meter and the form where a members issue is cut. `false` prints a plain link    |
| `price`      | Printed on the members button. Keep it in step with `plans`                                                      |
| `username`   | Your Buttondown newsletter username                                                                              |
| `homeRecent` | How many archive rows the home page lists                                                                        |

`theCut: false` changes only what is printed. The members part is still removed from the build;
nothing turns that off except leaving the marker out of an issue.

`plans` is the table on `/subscribe`, in order. Each row is `name`, `price` (printed as written)
and `detail`. Prices are not computed, so a currency, a "from" or a discount is just text.

## Subscribe forms

Every form on the site (home, the end of an issue, The Cut, `/subscribe`) posts to Buttondown:
set `newsletter.username` to your Buttondown username. The forms are plain HTML with no script,
and Buttondown's confirmation page opens in a new tab beside the issue.

Another provider: every form takes its destination from `src/lib/subscribe-target.ts`. Return
your provider's form `action` and the `name` of its email field there, from its HTML embed code.
Tearsheet Pro does this from `src/config.ts`, with worked examples for Kit, Mailchimp and
MailerLite.

### After the form: `/subscribed`

`/subscribed` is a thank-you page with three free issues to read while the confirmation email
arrives. It is left out of the sitemap and search engines. Point your provider's "after signup"
or "redirect" setting at `https://<your site>/subscribed` (Buttondown: Settings → Subscribing).

### Demo builds: `DEMO_FORMS=1`

```sh
DEMO_FORMS=1 pnpm build
```

Every form then goes to `/subscribed` and the page says it was a demo. The email input has no
`name`, so the address is not sent anywhere, not even into the URL. It is an environment variable
rather than a config key so it cannot be left on by accident in a normal build. Use it for a
preview deploy you share before the newsletter exists.

## Colours and other tokens

Every token is defined in `src/styles/tokens.css`. Do not edit that file; override in
`src/styles/theme.css`, whose rules win without specificity tricks.

```css
:root {
  --primary: light-dark(#8c1f2f, #e08792);
}
```

`light-dark(<light>, <dark>)` sets both modes; a plain colour sets both to the same value.

| Token             | Used for                                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------- |
| `--background`    | The page                                                                                    |
| `--surface`       | Spare: the theme draws rules, not tinted boxes, and sets none. `bg-surface` if you need one |
| `--foreground`    | Text, the heavy rules, the free part of every meter                                         |
| `--muted`         | Dates, meta, the dek                                                                        |
| `--border`        | Hairlines                                                                                   |
| `--primary`       | Issue numbers, the current nav item, the members button, links on hover, focus              |
| `--primary-hover` | The members button on hover                                                                 |
| `--on-primary`    | Text on `--primary`                                                                         |
| `--content-width` | The reading column, `40rem`                                                                 |
| `--wide-width`    | The widest container, `72rem`                                                               |
| `--radius`        | `0`. The theme has no rounded corners                                                       |

After changing a colour, run `pnpm check:contrast`. It measures every text token against every
background token, light and dark, against WCAG AA, and exits 1 if one fails.

`pnpm dev` serves `/styleguide`: every token and type size on one page. It is not part of a
build.

## Dark mode

The theme follows the reader's system setting, and the toggle in the header overrides it (the
choice is remembered per browser). `features.darkMode: false` in `src/config.ts` removes the
toggle; the system setting still applies.

## Webfonts

Piazzolla sets the body; Barlow Semi Condensed sets headings, issue numbers and the UI. Both are
defined in `fonts` in `astro.config.mjs` and self-hosted at build time; no request goes to a font
CDN.

To use another face, replace an entry there and keep its `cssVariable` (`--font-body` or
`--font-heading`). Keep the weights the theme sets (body 400 and 600 with italic; headings 500,
700 and 800) and check that its figures are tabular, or the archive's columns will not line up.
To use a system font instead, override `--font-body` or `--font-heading` in `theme.css`.

## Analytics

`src/config.ts`, `analytics`. Off by default: `provider: null` renders nothing and the site loads
no third-party script.

| ------------- | ------------------------- | -------------------------------------- |
| `'plausible'` | Your site's domain | Your instance's origin, if self-hosted |
| `'umami'` | The website ID | Your instance's origin, if self-hosted |
| `'ga4'` | The measurement ID, `G-…` | Ignored |

If you turn one on, update the Analytics paragraph in `src/pages/privacy.md` to match.

## SEO

`src/config.ts`, `seo`: `titleTemplate` (`%s` is the page title), `twitterHandle`, and
`jsonLd` (`Person` or `Organization`, and its name). Every page carries a canonical link, Open
Graph tags, JSON-LD and a sitemap entry. Issues add `BlogPosting` and breadcrumb data.

## Favicon

`public/favicon.svg` and `public/favicon.ico`. Replace both.
