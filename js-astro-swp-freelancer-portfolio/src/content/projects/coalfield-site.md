---
title: Coalfield site
client: Coalfield
year: '2025'
category: Web
excerpt: A marketing site rebuild the marketing team runs alone
description: A component-driven marketing site rebuild that moved page edits out of the engineering backlog.
image:
  src: /images/project-site.webp
  alt: A laptop, open notebook and coffee cup arranged on a wooden desk
  width: 900
  height: 675
services: ['Art direction', 'Front-end templates', 'Content model']
technologies: ['Astro', 'Design tokens', 'Markdown content']
results:
  - value: '8 days'
    label: For two engineers to build the whole site
  - value: '0'
    label: Engineering tickets for a copy change
  - value: '98'
    label: Lighthouse performance on the templates
featured: true
order: 3
---

## Every copy change was a ticket

Coalfield's old site was hand-built page by page. Changing a headline meant a pull
request, a review and a deploy. Marketing had a backlog of forty small edits that no
engineer would ever get to, so the site slowly stopped saying anything true.

## The fix was a content model, not a redesign

We spent longer on the shape of the content than on the look of it. What is a page made
of? Eight block types, it turned out — hero, feature row, proof strip, pricing table,
FAQ, quote, logo wall, closing call to action. Everything the team wanted to publish fit
into a stack of those eight.

- **Blocks, not pages.** Marketing assembles a page from blocks; nobody writes markup.
- **Content in Markdown.** Reviewable in a pull request, editable in a text box, and
  portable if they ever leave the stack.
- **Tokens for everything visual.** Spacing, colour and type come from one file, so a
  brand tweak is a one-line change rather than a sweep.

## The handover

Two engineers built the entire site from the component library in eight days. The
documentation is in the repository next to the components, which is the only place it
stands a chance of staying current.
