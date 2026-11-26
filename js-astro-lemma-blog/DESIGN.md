---
name: Chengrui Zhang
description: A bilingual research blog on equations and models, read like a well-set paper.
colors:
  accent: "#b5532f"
  accent-dark: "#e08b66"
  paper: "#faf9f5"
  paper-dark: "#171715"
  ink: "#191917"
  ink-dark: "#e9e6de"
  muted: "#6b6a64"
  muted-dark: "#9c998f"
  rule: "#e6e3d9"
  rule-dark: "#2e2d29"
  surface: "#f2f0e8"
  surface-dark: "#201f1c"
  raised: "#fffefb"
  raised-dark: "#22211e"
  selection: "#ead9cc"
  selection-dark: "#4a3328"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, Noto Serif SC Variable, serif"
    fontSize: "clamp(2rem, 5vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4 Variable, Noto Serif SC Variable, serif"
    fontSize: "1.625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Serif 4 Variable, Noto Serif SC Variable, serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.5
  body:
    fontFamily: "Source Serif 4 Variable, Noto Serif SC Variable, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  statement:
    fontFamily: "Source Serif 4 Variable, LXGW WenKai Screen, serif"
    fontSize: "1.125rem"
    lineHeight: 1.75
  small:
    fontFamily: "Source Serif 4 Variable, Noto Serif SC Variable, serif"
    fontSize: "0.9375rem"
    lineHeight: 1.6
  label:
    fontFamily: "Inter Variable, Noto Sans SC Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label-small:
    fontFamily: "Inter Variable, Noto Sans SC Variable, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
  code:
    fontFamily: "JetBrains Mono Variable, ui-monospace, monospace"
    fontSize: "0.875em"
    lineHeight: 1.6
rounded:
  tick: "1px"
  focus: "2px"
  inline: "4px"
  button: "6px"
  block: "8px"
  card: "14px"
spacing:
  measure: "46rem"
  gutter: "1.5rem"
  sidenote: "15rem"
  sidenote-gap: "2.5rem"
  tap: "2.75rem"
components:
  preview-card:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0.875rem 1rem"
    width: "min(26rem, 100vw - 1rem)"
  toc-card:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.card}"
    padding: "0.75rem 1rem"
    width: "19rem"
  search-panel:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    width: "min(36rem, 100vw - 1rem)"
  search-result:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.block}"
    padding: "0.625rem 0.75rem"
  code-block:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.block}"
    padding: "1rem 1.25rem"
  copy-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.muted}"
    typography: "{typography.label-small}"
    rounded: "{rounded.button}"
    padding: "0.25rem 0.625rem"
  sidenote:
    textColor: "{colors.muted}"
    width: "{spacing.sidenote}"
  inline-code:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.inline}"
    padding: "0.1em 0.35em"
---

# Design System: Chengrui Zhang

The token values above are set in `lemma.config.mjs` (`theme`, `code`), which generates the CSS custom properties; keep the two in step.

## Overview

**Creative North Star: "The Typeset Notebook"**

A personal research blog (AI for PDE, and mathematics around it) in Chinese and English. Each post should read like a carefully typeset paper on a screen: serif text on warm paper, numbered sections and theorems, captions where print puts them, citations that resolve. The labels around it (dates, meta lines, footer) are quiet sans-serif and stay out of the way. The look is clean and modern rather than antique: nothing imitates paper texture, and there are no ornaments.

Depth is minimal. The page is flat; only content that floats above it (TOC cards, link previews, the search panel, the About page's day card) is lifted, and all of it in the same way. Color is almost entirely neutral, with one terracotta accent for links and the current state.

**Key Characteristics:**
- Serif reading text and header, sans-serif labels, a one-column 46rem measure.
- Warm paper and ink neutrals, one terracotta accent.
- Paper conventions where they help reading: numbered sections and theorems, booktabs tables, figure captions below and table captions above, AMS-style references, an abstract and keywords under the title.
- Supporting content shown in place: margin sidenotes, link preview cards, a tick-mark TOC with section cards.
- Every page works in light and dark, from 320px phones to wide screens.

## Colors

Warm, low-chroma neutrals carry everything; the accent is the only saturated color.

### Primary
- **Terracotta** (accent / accent-dark): links on hover, cross-reference and citation numbers, focus rings, the current state. Lighter in dark mode to keep contrast.

### Neutral
- **Warm Paper** (paper / paper-dark): the page background.
- **Ink** (ink / ink-dark): body text and headings.
- **Graphite** (muted / muted-dark): secondary text: dates, captions, sidenotes, metadata, counts. Meets 4.5:1 on paper in both themes.
- **Hairline** (rule / rule-dark): borders, rules above notes, table rules, inactive TOC ticks.
- **Vellum** (surface / surface-dark): code blocks, inline code, the BibTeX block, video placeholders, the current search result (light), the About page's contact buttons.
- **Lifted Paper** (raised / raised-dark): the one floating surface (cards).
- **Highlight** (selection / selection-dark): text selection, and the matches in search excerpts.

**The One Accent Rule.** Terracotta marks what is interactive or current, and nothing else: no accent backgrounds, no accent headings.

**The Readable Code Rule.** Syntax colors (Vitesse themes) are raised to 4.5:1 against Vellum at build time (`plugins/shiki-themes.mjs`); hue stays, lightness moves.

## Typography

**Body Font:** Source Serif 4 (with Noto Serif SC for Chinese)
**Statement Font:** LXGW WenKai Screen, Chinese theorem statements only (Latin stays Source Serif 4)
**Label Font:** Inter (with Noto Sans SC)
**Mono Font:** JetBrains Mono (the Nerd Font build when installed locally)

**Character:** A text serif with optical sizes for reading, a neutral grotesque for the labels around it. Latin fonts come first in every stack, so English and digits never fall back to the CJK font.

### Hierarchy
- **Display** (500, clamp(2rem, 5vw, 2.75rem), 1.2): post titles, wrapped with `text-wrap: pretty` (lines filled by length, no lone last character; `balance` broke hyphenated names to even the lines).
- **Headline** (600, 1.625rem, 1.35): numbered section headings (h2); h3 at 1.25rem.
- **Title** (500, 1.25rem, 1.5): post titles in lists; the home intro (formula or tagline) is 1.75rem.
- **Body** (400, 1.125rem, 1.75): article text, 46rem measure. Abstract and keywords 1rem / 0.9375rem, indented from both sides.
- **Small** (0.9375rem): captions, references, footnotes, tables, preview cards, post summaries in lists (Graphite); sidenotes 0.875rem.
- **Label** (0.875rem sans): dates, post facts, footer.
- **Label Small** (0.8125rem sans): copy buttons.

**The Justify Rule.** Chinese body text is justified from 48rem up and ragged below that, and always ragged in sidenotes and cards. Latin text is never justified.

**The Spacing Rule.** Chinese and adjacent Latin words or digits are separated by a space (`2026 年 10 月 10 日 · 约 8 分钟 · 7 节`); UI copy uses ASCII punctuation.

## Layout

One centered column: the body is 46rem of text plus 1.5rem gutters. The header (avatar, wordmark, navigation) and footer share the column.

- **TOC** (72rem and up): a column of tick marks fixed in the left margin, one per h2/h3; the current section's tick is long and dark.
- **Sidenotes** (75rem and up, posts with footnotes): a 15rem column 2.5rem right of the text. The text stays centered while the right margin fits it (84rem and up); between 75rem and 84rem the page shifts left just enough, and the TOC moves with it. Notes align their first baseline with the reference and stack downward when they would overlap.
- **Below 75rem:** footnotes return to the end of the post. Below 72rem the TOC is hidden.
- **Overflow:** wide formulas, tables, diagrams and code scroll sideways inside the column, with an edge fade on the side that has more.

**The No Horizontal Scroll Rule.** At 320px nothing makes the page scroll sideways; only individual blocks do.

## Elevation & Depth

Flat by default. The only elevation is the floating card, used for TOC section cards and link previews (appearing on hover, focus or tap), the search panel and the day card of the About page's activity.

### Shadow Vocabulary
- **Raised** (`0 1px 2px rgb(25 25 23 / 0.06), 0 12px 32px -8px rgb(25 25 23 / 0.2)`): cards in light mode.
- **Raised, dark** (`0 0 0 1px rgb(255 255 255 / 0.07), 0 16px 40px -8px rgb(0 0 0 / 0.6)`): shadows barely read on dark, so a faint ring carries the edge.

**The One Floating Surface Rule.** Anything that floats uses Lifted Paper, the 14px radius and the Raised shadow. There is no second popover or dialog style.

## Shapes

Small, quiet radii that grow with the size of the thing: 1px TOC ticks, 2px focus rings, 4px inline code and video, 6px buttons, 8px code blocks, 14px floating cards, a circle for the avatar. The About page's buttons and project panels follow shadcn/ui instead: 8px small buttons, 10px buttons and panels, pills for a stack's words. Boxes are rare: tables use horizontal rules only (booktabs), notes get a short rule above them, and theorems are set by type, not by frames.

## Components

### Navigation
- **Header:** 32px circular avatar and serif wordmark on the left; two groups on the right, 1.5rem apart: serif links at 1rem (Posts, About; 1rem apart), then three icons set close together (2.25rem from center to center): a language switch (a translate icon, named in the language it leads to: English / 中文), search and a sun/moon theme toggle (44px hit areas, Graphite, Ink on hover). Links are muted and turn Ink on hover; the current page's link stays Ink. About appears only for a language that has an about page. Below 27rem the avatar stands alone (the name stays the link's accessible name), so the links fit at 320px with room to spare.
- **Footer:** © line, then Email, GitHub and RSS links; wraps to two rows at 320px. In a language with an About page, Email and GitHub are left out: the page's contact links stand in for them.
- **Tap targets:** small text links get a 2.75rem hit area through padding and matching negative margins.

### Search panel
- **Trigger:** the search button, `/` (outside text fields) or Cmd/Ctrl+K. Pagefind's script and index load on the first open.
- **Style:** the one floating surface, `min(36rem, 100vw - 1rem)` wide, 6rem from the top (12vh on short screens); below 36rem it spans the width 0.5rem from the top. The backdrop fades the page toward Warm Paper (60%) rather than darkening it: no second shadow or scrim color.
- **Field:** a magnifier and a 16px sans input (phones do not zoom), a Hairline rule below. Touch screens get a 取消 / Cancel button, since they have no Escape key.
- **Results:** up to 8 posts; the title in serif 1.0625rem / 500, then date and the matching section in sans 0.8125rem Graphite, then two lines of excerpt in serif 0.875rem Graphite with matches on Highlight. The current result (first by default; arrow keys or the pointer move it) sits on Vellum (Hairline in dark, where Vellum barely shows on Lifted Paper) with its title in terracotta. In light mode the title takes 12% Ink (`color-mix(in srgb, accent 88%, text)`), since plain terracotta on Vellum is 4.34:1, below 4.5:1; mixed it is 5.1:1, still the same hue. Dark mode keeps the plain accent (5.3:1 on Hairline). A result links to its best-matching section.
- **States:** one sans line in Graphite: a hint (plus key hints on pointer devices), "searching" after 300ms, no results, no posts yet (an empty index), and in dev, no index until a build.
- **Motion:** opens with a fade, an 8px drop and a 0.98 to 1 scale in 0.2s (ease-out), and closes faster, in 0.12s, rising 6px as it fades; the backdrop fades with it. Following a result closes at once, so the page is not scrolled back to the search button. With reduced motion, the fades only.

### TOC
- **Ticks:** 2px bars in Hairline, shorter for h3; the current one is full length in Ink.
- **Section card:** on hover or focus of a tick, a floating card with the section title (bold, one line) and its first paragraph (serif, muted, three lines).

### Link preview card
- **Trigger:** citations, `\ref` to sections, theorems, figures and tables, `\eqref`, and footnote references where no sidenote is shown. Opens after 200ms of hover, on keyboard focus, or on the first tap (a second tap follows the link).
- **Content:** a copy of the target; cut at 18rem with a bottom fade, then a "Jump" link (always shown on touch).
- **Style:** the one floating surface, 26rem wide at most, placed below the link or above it when that is the only fit.

### Sidenote
- **Style:** serif 0.875rem in Graphite, number in bold Ink; a reference and its note turn Ink/terracotta together on hover.

### Theorem
- **Head:** bold label and number (定理 2.2 / Theorem 2.2) with an optional name in parentheses. Statements of theorem-like kinds are in LXGW WenKai (Chinese) or italic (English); definitions and remarks stay upright. Proofs end with a right-aligned ∎.

### Figure and table
- **Captions:** small, centered while short, with a bold "图 1." / "Table 1." label; below figures, above tables. Line art can invert in dark mode.
- **Tables:** booktabs rules (1.5px top and bottom, a 1px rule under the header), no vertical lines.
- **Zoom:** a figure with one image widens in the flow of the text, past the measure to the window (24px from its sides; 8px below 600px), when that makes the image at least 15% larger; nothing floats over the page. Raster images stop at their own pixels, vector ones at three times their size and 1600px. Where the window is less than 1.3 times the column (phones), the image takes twice the column and scrolls sideways in the widened box, with the usual edge fade. The image is a toggle button (全宽显示 / Full width, with its alt text) with no look of its own: `zoom-in` / `zoom-out` cursors and the focus ring. A click, Enter or Space widens it, again or Escape puts it back.
- **Zoom motion:** the image moves by transform from where it was to where it ends, while its box's height, and so the text below, changes on the same curve: 380ms to widen, 300ms back, `cubic-bezier(0.2, 0, 0, 1)`. Widening near the bottom of the window scrolls on the same curve until the caption shows, never past the figure's top. With reduced motion it changes at once.
- **Zoom neighbors:** the TOC fades out while a widened figure is on screen, and so do the sidenotes beside it (0.2s); link previews of the figure show it at its normal size; print puts it back in the column.

### Code block
- **Style:** Vellum background, 1px Hairline border, 8px radius, JetBrains Mono.
- **Copy button:** top right; appears on hover or focus on pointer devices and always on touch (the code moves down to make room). Shows 已复制 / Copied for 1.5s.

### Home intro
- **Formula** (`site.intro.formula`): TeX set by MathJax like the math in posts, at 1.75rem, Ink, labelled with its TeX for screen readers. Without one, the site description shows as text in serif 1.75rem; it serves the meta description and RSS either way.
- **Curve mark** (`site.intro.curve`, optional): a 4rem square before the formula or text, after paidax01's math curve loaders. A comet of 60 Ink dots, each smaller and fainter than the one before, runs along a closed curve over its track in Ink at 10%; the curve breathes and, for some, slowly turns. The default, `monge-ampere`, is a level set of a solution of det D²u = 1 (a quadratic with det A = 1), with two inner level sets as 1.5-unit lines at 16%: the ellipses stretch and turn, their areas fixed. Also ring, rose, Lissajous, lemniscate and spirograph. It runs while on screen. Not the accent: it is not interactive. With reduced motion or without JavaScript, the first frame stays.

### Post header
- **Order:** title; a sans meta line (date · reading time · sections, and "Read in English" on the right); the abstract, then keywords, both indented like a paper's.
- **AI badge** (`ai: true`, a post written by AI): after the facts on the meta line, a pill like the About page's stack badges: a filled sparkle and "AI", sans 0.8125rem / 500 Ink on Vellum, 1.5rem tall, with a Hairline ring in dark mode. Screen readers hear the full sentence (本文由 AI 撰写. / This post was written by AI.). Not the accent: it is not interactive.

### Tags page
- **Index:** like the index at the back of a book: Chinese tags by pinyin (word-level, so 调和 is T) and Latin tags by letter in one sequence, under their initials (sans 0.875rem / 600 Graphite), in two columns from 39rem. Each entry is the name in serif, a dotted Graphite leader and the count; it opens in place (`<details>`, no JavaScript) to list its posts with their dates, and its name turns Terracotta while open. No categories above tags.
- **Jump line:** the initials as links above the index, only from 8 initials on.
- **Ways in:** the home page's one-line tag list, ordered by count, shows at most 12 tags; past that it shows the 12 most used and ends with 全部 N 个标签 → / All N tags →. Every tag page has 全部标签 / All tags beside 全部文章 / All posts.

### About page
- **Head:** the name in Display, the tagline in serif Graphite, the contact links, then the bio as body text.
- **Contact links:** under the name, a wrapping row of buttons in the manner of shadcn/ui's secondary button, 0.375rem apart (0.75rem between rows): 2rem tall, sans 0.875rem / 500 Ink on Vellum, 10px radius, 0 0.625rem padding, each a 1rem icon (mail, GitHub, file, link) and what the link leads to: the email address, the GitHub user name, otherwise its label. Hover turns the fill Hairline, and a press moves the button down 1px (not with reduced motion); in dark mode a Hairline ring carries the edge, since Vellum barely shows on dark paper. The hit area reaches 2.75rem into the row gap.
- **Link row:** sans links in Graphite, separated by middle dots that stay with the link before them (a wrapped row never starts with a dot); terracotta on hover. 0.8125rem, under an entry. The BibTeX copy button is set as one more link and shows 已复制 / Copied for 1.5s.
- **Sections:** an unnumbered Headline, then entries in two columns like the post list: the date in a 6rem sans column (Graphite, tabular numbers) on the title's baseline, and the entry in serif: title at 1.125rem / 500 (an ordinary link when it has one), a Graphite subtitle and a note at 0.9375rem, a link row. Below 40rem the date moves above its entry. A list in which no entry has a date has no date column.
- **Blocks:** the activity right under the bio, so the top of the page is always name, links, bio and activity; then the frontmatter's other sections in their order. Besides entries and papers: **now** (a short rule above, as notes have; a sans Graphite label with the date, the text in serif 1.125rem, then the place and its local time in sans 0.875rem, the time in Ink), **facts** and **stack** (a label in the 6rem date column, sans Graphite; the value in serif; a stack's words as badges: sans 0.8125rem / 500 pills on Vellum, 1.5rem tall, 0.375rem apart), **projects** (items, as shadcn/ui's: a panel of 60% Vellum over Paper, 10px radius, 0.875rem 1.125rem padding, 0.625rem apart; the title in serif 1.125rem / 500 with its year in sans Graphite, the note in serif 0.9375rem Graphite, as entries have; on hover the title takes 12% Ink in light mode, since plain terracotta on the panel is 4.4:1; on the right, small buttons in sans 0.75rem / 500 on Hairline, 1.75rem tall with an 8px radius: the stars and a GitHub icon for the repository (the icon alone when it has none), the extra links, an arrow for the site. They go under the note when the panel is narrow, and reach a 2.75rem tall hit area; the dark-mode ring of the contact buttons goes around panels and badges too), **posts** (entries; the date in the 6rem column, in Chinese as 2026-10-10, since 2026 年 10 月 10 日 would take two lines).
- **Activity:** a year of GitHub contributions, a column per week (Sunday first), 3px gaps, 2px radius; GitHub's five levels as Hairline, then Ink at 22, 42, 66 and 90% over paper, never the accent. Month names (sans 0.75rem Graphite) over the week holding the 1st. Below it the total, linked to the GitHub profile, and a Less/More legend. A day's count shows in the one floating card, one line of sans 0.8125rem, above the day: after a 200ms rest on hover, on touch, or with the arrow keys once the grid has focus (↑ ↓ a day, ← → a week; Escape closes); the day gets a 1.5px terracotta outline. Days are about 10px, below the 2.75rem tap target: a touch takes the day nearest the finger and follows it as it slides sideways (the page still scrolls up and down), and the keyboard reaches every day. A calendar whose last day is more than two days ago (an old cached copy, or a page built days ago, checked in the browser) adds "as of" its date to the total, which is a small text link with the usual 2.75rem hit area. Narrow containers show the last 26 weeks (below 34rem) or 17 (below 17rem).
- **Publications:** newest first, the year on the first entry of each year only. Authors in Graphite with the owner's name in bold Ink; the venue in italic, upright when it is Chinese. No cards, boxes or fills.
- **Print:** black on white with no header, footer, copy buttons, activity or project buttons; the links under the name print as their addresses, and buttons, badges and panels without fills; no entry is split across pages.

## Do's and Don'ts

### Do:
- **Do** use the accent only for interactive or current things.
- **Do** keep every floating element on the one card style.
- **Do** check light and dark at 320, 390, 1280 and 1440px after a visual change.
- **Do** give every hover affordance a keyboard-focus and a touch equivalent.
- **Do** keep text at 4.5:1 or better in both themes, including code and secondary text.

### Don't:
- **Don't** add boxes, frames or background fills to theorems, notes or sections; set them with type and rules.
- **Don't** justify narrow columns or Latin text.
- **Don't** add vertical rules to tables.
- **Don't** add a second accent color or a second shadow style.
